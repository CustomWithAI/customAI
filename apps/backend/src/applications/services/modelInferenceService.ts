import type { TrainingRepository } from "@/applications/repositories/trainingRepository";
import { NotFoundError, InternalServerError } from "elysia";
import { deleteFile, uploadFile } from "@/infrastructures/s3/s3";
import { v7 } from "uuid";
import { generatePresignedUrl } from "@/infrastructures/s3/s3";
import { sendToRabbitMQ } from "@/infrastructures/rabbitmq/queue";
import type {
  CreateTrainingModelInferenceDto,
  CreateUploadModelInferenceDto,
} from "@/domains/dtos/modelInference";
import type { ModelInferenceRepository } from "@/applications/repositories/modelInferenceRepository";
import type { PaginationParams } from "@/utils/db-type";
import { convertToJpg } from "@/utils/file";

export class ModelInferenceService {
  public constructor(
    private repository: ModelInferenceRepository,
    private trainingRepository: TrainingRepository
  ) {}

  private async uploadModel(file: File) {
    const path = `inference-models/${v7()}-${file.name}`;
    const buffer = await file.arrayBuffer();
    await uploadFile(path, buffer, "application/octet-stream");
    return path;
  }

  private async uploadImage(file: File) {
    const path = `inference-images/${v7()}.jpg`;
    const buffer = await convertToJpg(file);
    await uploadFile(path, buffer, "image/jpg");
    return path;
  }

  public async createFromWorkflow(
    userId: string,
    workflowId: string,
    data: CreateTrainingModelInferenceDto
  ) {
    const defaultTraining = await this.trainingRepository.findByDefault(
      workflowId
    );

    if (!defaultTraining[0]) {
      throw new NotFoundError("Default training not found for this workflow");
    }

    return this.createInference(userId, data, defaultTraining[0].id);
  }

  public async createFromTraining(
    userId: string,
    workflowId: string,
    trainingId: string,
    data: CreateTrainingModelInferenceDto
  ) {
    const training = await this.trainingRepository.findById(
      workflowId,
      trainingId
    );

    if (!training.length) {
      throw new NotFoundError(`Training not found: ${trainingId}`);
    }

    return this.createInference(userId, data, trainingId);
  }

  public async createFromUpload(
    userId: string,
    data: CreateUploadModelInferenceDto
  ) {
    return this.createInference(userId, data);
  }

  private async createInference(
    userId: string,
    data: CreateTrainingModelInferenceDto | CreateUploadModelInferenceDto,
    trainingId?: string
  ) {
    const imagePath = await this.uploadImage(data.image);
    let modelPath: string | undefined = undefined;
    let modelConfig: object | undefined = undefined;

    if ("model" in data && data.model) {
      modelPath = await this.uploadModel(data.model);
    }

    if ("config" in data && data.config) {
      modelConfig = data.config;
    }

    const result = await this.repository.create({
      trainingId,
      modelPath,
      modelConfig,
      imagePath,
      status: "pending",
      userId,
    });

    if (!result.length) {
      throw new InternalServerError("Failed to create model inference");
    }

    const { queueId } = await sendToRabbitMQ(result[0], "inference");

    await this.repository.updateStatus(result[0].id, "pending", queueId);

    return {
      ...result[0],
      imagePath: generatePresignedUrl(result[0].imagePath),
      modelPath: result[0].modelPath
        ? generatePresignedUrl(result[0].modelPath)
        : null,
      queueId,
    };
  }

  public async getModelInferencesByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    const result = await this.repository.findByUserId(userId, pagination);
    return {
      ...result,
      data: result.data.map((data) => ({
        ...data,
        imagePath: generatePresignedUrl(data.imagePath),
        modelPath: data.modelPath ? generatePresignedUrl(data.modelPath) : null,
      })),
    };
  }

  public async getModelInferenceById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (!result.length) {
      throw new NotFoundError(`Model Inference not found: ${id}`);
    }
    return {
      ...result[0],
      imagePath: generatePresignedUrl(result[0].imagePath),
      modelPath: result[0].modelPath
        ? generatePresignedUrl(result[0].modelPath)
        : null,
    };
  }

  public async deleteModelInference(userId: string, id: string) {
    const result = await this.repository.deleteById(userId, id);
    if (!result.length) {
      throw new NotFoundError(`Model Inference not found: ${id}`);
    }

    await deleteFile(result[0].imagePath);

    if (result[0].modelPath) {
      await deleteFile(result[0].modelPath);
    }

    return { message: "Model Inference deleted successfully" };
  }
}
