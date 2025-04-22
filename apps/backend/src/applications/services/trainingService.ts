import type { ImageRepository } from "@/applications/repositories/imageRepository";
import type { TrainingRepository } from "@/applications/repositories/trainingRepository";
import type { WorkflowRepository } from "@/applications/repositories/workflowRepository";
import { config } from "@/config/env";
import type { CreateTrainingDto } from "@/domains/dtos/training";
import type { TrainingStatusEnum, trainings } from "@/domains/schema/trainings";
import { sendToRabbitMQ } from "@/infrastructures/rabbitmq/queue";
import { generatePresignedUrl } from "@/infrastructures/s3/s3";
import type { PaginationParams } from "@/utils/db-type";
import { isLabels } from "@/utils/split-data";
import { incrementVersion } from "@/utils/version";
import { InternalServerError, NotFoundError, error } from "elysia";

export class TrainingService {
  public constructor(
    private repository: TrainingRepository,
    private workflowRepository: WorkflowRepository,
    private imageRepository: ImageRepository
  ) {}

  private async ensureWorkflowExists(userId: string, workflowId: string) {
    const workflow = await this.workflowRepository.findById(userId, workflowId);
    if (!workflow.length) {
      throw new NotFoundError(`Workflow not found: ${workflowId}`);
    }
  }

  public async createTraining(
    userId: string,
    workflowId: string,
    data: CreateTrainingDto
  ) {
    await this.ensureWorkflowExists(userId, workflowId);

    const versionTrainings = await this.repository.findLatestByWorkflowId(
      workflowId
    );

    let isDefault: boolean;

    if (
      versionTrainings?.[0]?.version !== null &&
      versionTrainings?.[0]?.version !== undefined
    ) {
      data.version = incrementVersion(versionTrainings[0].version, "minor");
      isDefault = false;
    } else {
      data.version = "1.0.0";
      isDefault = true;
    }

    const result = await this.repository.create({
      ...data,
      isDefault,
      version: data.version,
      workflowId,
    });

    if (result.length === 0) {
      throw new InternalServerError("Failed to create training");
    }
    return result[0];
  }

  public async getTrainingsByWorkflowId(
    userId: string,
    workflowId: string,
    pagination: PaginationParams
  ) {
    await this.ensureWorkflowExists(userId, workflowId);
    const result = await this.repository.findByWorkflowId(
      workflowId,
      pagination
    );
    return {
      ...result,
      data: result.data.map((training) => {
        return {
          ...training,
          trainedModelPath: training.trainedModelPath
            ? generatePresignedUrl(training.trainedModelPath)
            : null,
        };
      }),
    };
  }

  public async getTrainingById(userId: string, workflowId: string, id: string) {
    await this.ensureWorkflowExists(userId, workflowId);

    const result = await this.repository.findById(workflowId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }
    result[0].trainedModelPath = result[0].trainedModelPath
      ? generatePresignedUrl(result[0].trainedModelPath)
      : null;
    return result[0];
  }

  public async getTrainingByDefault(userId: string, workflowId: string) {
    await this.ensureWorkflowExists(userId, workflowId);

    const result = await this.repository.findByDefault(workflowId);
    if (result.length === 0) {
      throw new NotFoundError("Default training not found");
    }
    result[0].trainedModelPath = result[0].trainedModelPath
      ? generatePresignedUrl(result[0].trainedModelPath)
      : null;
    return result[0];
  }

  public async updateTraining(
    userId: string,
    workflowId: string,
    id: string,
    data: Partial<typeof trainings.$inferInsert>
  ) {
    await this.ensureWorkflowExists(userId, workflowId);

    const result = await this.repository.updateById(workflowId, id, data);
    if (result.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }
    return result[0];
  }

  public async deleteTraining(userId: string, workflowId: string, id: string) {
    await this.ensureWorkflowExists(userId, workflowId);

    const result = await this.repository.deleteById(workflowId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }
    return result[0];
  }

  public async startTraining(userId: string, workflowId: string, id: string) {
    await this.ensureWorkflowExists(userId, workflowId);

    const trainings = await this.repository.findById(workflowId, id);
    if (trainings.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }

    const training = trainings[0];

    // Part Check Status
    if (training.status !== "created" && training.status !== "failed") {
      throw error(400, "Training has already started");
    }

    // if (
    //   training.status === "failed" &&
    //   training.retryCount < config.MAX_RETRY_COUNT
    // ) {
    //   throw error(400, "Training is in process after some errors occurred");
    // }

    // Part Data Validation

    // Have Dataset or Not
    if (!training.dataset) {
      throw error(400, "Dataset is required");
    }

    // Check Dataset Match Workflow Type or Not
    if (training.dataset.annotationMethod !== training.workflow.type) {
      throw error(
        400,
        "Dataset annotation method does not match workflow type"
      );
    }

    // Have Model or Not
    if (
      !training.machineLearningModel &&
      !training.preTrainedModel &&
      !training.customModel
    ) {
      throw error(
        400,
        "Pre-trained model, custom model or machine learning model is required"
      );
    }

    // Have Hyperparameter or Not
    if (
      !(
        training.workflow.type === "classification" &&
        training.machineLearningModel
      )
    ) {
      if (
        typeof training.hyperparameter !== "object" ||
        training.hyperparameter === null
      ) {
        throw new InternalServerError("Hyperparameter must be an object");
      }

      if (Object.keys(training.hyperparameter).length === 0) {
        throw error(400, "Hyperparameter is required");
      }
    }

    // Dataset Have Train Test Valid or Not
    if (
      !training.dataset.train ||
      !training.dataset.test ||
      !training.dataset.valid
    ) {
      throw error(400, "Train/Test/Valid ratio in dataset is required");
    }

    // Dataset Have Split Method or Not
    if (!training.dataset.splitMethod) {
      throw error(400, "Split method in dataset is required");
    }

    // Labels matching format
    if (!isLabels(training.dataset.labels)) {
      throw error(400, "Format of dataset labels not matching");
    }

    // Dataset Have Labels or Not
    if (!training.dataset.labels || training.dataset.labels.length === 0) {
      throw error(400, "Labels in dataset is required");
    }

    // Have Model or Not
    if (
      training.workflow.type === "classification" &&
      !training.preTrainedModel &&
      !training.machineLearningModel &&
      !training.customModel
    ) {
      throw error(
        400,
        `Pre-trained model, machine learning model, or custom model is required for ${training.workflow.type}`
      );
    }

    if (
      training.workflow.type === "object_detection" &&
      !training.preTrainedModel &&
      !training.customModel
    ) {
      throw error(
        400,
        `Pre-trained model or custom model is required for ${training.workflow.type}`
      );
    }

    if (
      training.workflow.type === "segmentation" &&
      !training.preTrainedModel
    ) {
      throw error(
        400,
        `Pre-trained model is required for ${training.workflow.type}`
      );
    }

    // Check All Images Have Class and Annotation or Not
    const { data: images } = await this.imageRepository.findByDatasetId(
      training.dataset.id,
      { limit: 1000 }
    );

    const hasMissingAnnotation = images.some((image) => !image.annotation);

    if (hasMissingAnnotation) {
      throw error(
        400,
        `There are images without annotations, but they are required for ${training.workflow.type}`
      );
    }

    const queueId = await sendToRabbitMQ(training);

    await this.repository.updateStatus(id, "pending", queueId);

    return { message: "Training added to queue", queueId };
  }

  public async setTrainingToDefault(
    userId: string,
    workflowId: string,
    id: string
  ) {
    await this.ensureWorkflowExists(userId, workflowId);

    await this.repository.updateByWorkflowId(workflowId, { isDefault: false });

    const result = await this.repository.updateById(workflowId, id, {
      isDefault: true,
    });

    if (result.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }

    return result[0];
  }
}
