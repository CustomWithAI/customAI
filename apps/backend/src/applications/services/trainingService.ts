import type { ImageRepository } from "@/applications/repositories/imageRepository";
import type { TrainingRepository } from "@/applications/repositories/trainingRepository";
import type { WorkflowRepository } from "@/applications/repositories/workflowRepository";
import type { ActivityLogRepository } from "@/applications/repositories/activityLogRepository";
import { config } from "@/config/env";
import type { CreateTrainingDto } from "@/domains/dtos/training";
import type { trainings } from "@/domains/schema/trainings";
import { sendToRabbitMQ } from "@/infrastructures/rabbitmq/queue";
import { deleteFile, generatePresignedUrl } from "@/infrastructures/s3/s3";
import type { PaginationParams } from "@/utils/db-type";
import { emit } from "@/utils/emit";
import { isLabels } from "@/utils/split-data";
import { incrementVersion } from "@/utils/version";
import { sleep } from "bun";
import { InternalServerError, NotFoundError, error } from "elysia";
import { v7 } from "uuid";

export class TrainingService {
  public constructor(
    private repository: TrainingRepository,
    private workflowRepository: WorkflowRepository,
    private imageRepository: ImageRepository,
    private activityLogRepository: ActivityLogRepository
  ) {}

  private async ensureWorkflowExists(userId: string, workflowId: string) {
    const workflow = await this.workflowRepository.findById(userId, workflowId);
    if (!workflow.length) {
      throw error(404, `Workflow not found: ${workflowId}`);
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

    if (versionTrainings.length !== 0) {
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

    const trainings = await this.repository.findPureDataById(workflowId, id);
    if (trainings.length !== 0 && trainings[0].isDefault) {
      throw error(400, "This training is default version.");
    }

    const result = await this.repository.deleteById(workflowId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }
    if (result[0].trainedModelPath) {
      await deleteFile(result[0].trainedModelPath);
    }

    await this.activityLogRepository.create({
      type: "training_delete",
      version: result[0].version,
      workflowId,
    });

    return result[0];
  }

  public async *startTraining(userId: string, workflowId: string, id: string) {
    yield emit("Starting workflow training", true);

    await this.ensureWorkflowExists(userId, workflowId);

    const trainings = await this.repository.findById(workflowId, id);
    if (trainings.length === 0) {
      yield emit("Validating training data", false);
      throw error(404, {
        type: "training",
        message: `Training not found: ${id}`,
      });
    }

    const training = trainings[0];

    // At least preprocessing have resize [80x80]
    if (!training.imagePreprocessing) {
      training.imagePreprocessing = {
        id: v7(),
        name: "Default Image Preprocessing",
        data: {
          resize: [100, 100],
          priority: ["resize"],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      };
    }

    const canStart =
      training.status === "created" ||
      training.status === "completed" ||
      (training.status === "failed" &&
        training.retryCount <= config.MAX_RETRY_COUNT);
    yield emit("Checking training status", canStart);

    if (!canStart) {
      throw error(400, {
        type: "training",
        message:
          training.status === "failed"
            ? "Training is in process after some errors occurred"
            : "Training has already started",
      });
    }

    yield emit("Validating dataset..", true);

    const { dataset } = training;

    if (!dataset)
      throw error(400, { type: "dataset", message: "Dataset is required" });

    const { annotationMethod, train, test, valid, splitMethod, labels } =
      dataset;

    if (annotationMethod !== training.workflow.type) {
      throw error(400, {
        type: "dataset",
        message: "Dataset annotation method mismatch",
      });
    }
    if (!train || !test || !valid) {
      throw error(400, {
        type: "dataset",
        message: "Train/Test/Valid split required",
      });
    }
    if (!splitMethod) {
      throw error(400, { type: "dataset", message: "Split method required" });
    }
    if (!isLabels(labels)) {
      throw error(400, { type: "dataset", message: "Labels are required" });
    }

    if (!labels || labels.length === 0) {
      throw error(400, {
        type: "dataset",
        message: "Labels in dataset is required",
      });
    }

    yield emit("Validating model configuration..", true);

    const { machineLearningModel, preTrainedModel, customModel } = training;
    const workflowType = training.workflow.type;

    const hasModel = machineLearningModel || preTrainedModel || customModel;

    if (!hasModel) {
      throw error(400, {
        type: "model",
        message: "At least one model is required",
      });
    }

    if (
      workflowType === "object_detection" &&
      !(preTrainedModel || customModel)
    ) {
      throw error(400, {
        type: "model",
        message: "Pre-trained or custom model required for object detection",
      });
    }

    if (workflowType === "segmentation" && !preTrainedModel) {
      throw error(400, {
        type: "model",
        message: "Pre-trained model required for segmentation",
      });
    }

    yield emit("Validating hyperparameters..", true);

    sleep(1000);

    yield emit("Checking image annotations..", true);

    const { data: images } = await this.imageRepository.findByDatasetId(
      dataset.id,
      { limit: 1000 }
    );

    if (images.some((image) => !image.annotation)) {
      throw error(400, {
        type: "model",
        message: "Images without annotations detected",
      });
    }

    yield emit("Image annotations validated", true);

    yield emit("Queueing training job", true);

    const { queueId, messagePending } = await sendToRabbitMQ(
      training,
      "training"
    );
    await this.repository.updateStatus(id, "pending", queueId);

    await this.activityLogRepository.create({
      type: "training_start",
      version: training.version,
      workflowId,
    });

    await this.activityLogRepository.create({
      type: "training_pending",
      version: training.version,
      workflowId,
    });

    yield emit("Training job queued successfully", true);

    return { message: "Training added to queue", queueId, messagePending };
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

    await this.activityLogRepository.create({
      type: "training_set_default",
      version: result[0].version,
      workflowId,
    });

    return result[0];
  }

  public async cloneTraining(userId: string, workflowId: string, id: string) {
    await this.ensureWorkflowExists(userId, workflowId);

    const trainings = await this.repository.findPureDataById(workflowId, id);

    if (trainings.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }

    const {
      id: trainingId,
      createdAt,
      updatedAt,
      version,
      ...training
    } = trainings[0];

    const latestVersion = await this.repository.findLatestByVersion(
      workflowId,
      version,
      "patch"
    );

    const result = await this.repository.create({
      ...training,
      isDefault: false,
      version: incrementVersion(
        latestVersion.length === 0 ? version : latestVersion[0].version,
        "patch"
      ),
      status: "created",
      queueId: null,
      retryCount: 0,
      errorMessage: null,
      trainedModelPath: null,
      evaluation: null,
      evaluationImage: null,
    });

    if (result.length === 0) {
      throw new InternalServerError("Failed to create training");
    }

    await this.activityLogRepository.create({
      type: "training_clone",
      version: result[0].version,
      fromVersion: version,
      workflowId,
    });

    return result[0];
  }
}
