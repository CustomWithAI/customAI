import {
  connectRabbitMQ,
  getRabbitMQChannel,
} from "@/infrastructures/rabbitmq/connection";
import { imageService, trainingRepository } from "@/config/dependencies";
import { logger, queueLogger } from "@/config/logger";
import { config } from "@/config/env";
import type { TrainingResponseDto } from "@/domains/dtos/training";
import { retryConnection } from "@/utils/retry";
import { connectRedis } from "@/infrastructures/redis/connection";
import { connectDatabase } from "@/infrastructures/database/connection";
import { connectS3 } from "@/infrastructures/s3/connection";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { defaultSplit, stratifiedSplit } from "@/utils/split-data";
import { uploadFile } from "@/infrastructures/s3/s3";

export const startTrainingWorker = async () => {
  const channel = await getRabbitMQChannel();
  if (!channel) {
    queueLogger.error("❌ RabbitMQ worker failed to start (No channel)");
    return;
  }

  // ✅ Worker Fetch 1 Request Per Round
  await channel.prefetch(1);

  await channel.assertQueue(config.RABBITMQ_TRAINING_QUEUE_NAME, {
    durable: true,
  });

  queueLogger.info("🐰 RabbitMQ worker started, waiting for messages...");

  // TODO: Delete after debug OK?
  config.PYTHON_SERVER_URL = "http://host.docker.internal:8000";

  channel.consume(
    config.RABBITMQ_TRAINING_QUEUE_NAME,
    async (msg) => {
      if (msg) {
        const trainingData = JSON.parse(
          msg.content.toString()
        ) as TrainingResponseDto;

        queueLogger.info(`🚀 Processing training: ${trainingData.queueId}`);

        try {
          // ✅ Update Status Into "prepare_dataset"
          await trainingRepository.updateById(
            trainingData.workflow.id,
            trainingData.id,
            { status: "prepare_dataset" }
          );

          if (!trainingData.dataset) {
            throw new Error("Training dataset not found");
          }

          const { data: images } = await imageService.getImagesByDatasetId(
            trainingData.workflow.userId,
            trainingData.dataset.id,
            { limit: 1000 }
          );

          const { train, test, valid, labels, annotationMethod, splitMethod } =
            trainingData.dataset;

          if (!train || !test || !valid) {
            throw new Error("Train/Test/Valid ratio in dataset not found");
          }

          if (!labels) {
            throw new Error("Dataset labels not found");
          }

          if (!annotationMethod) {
            throw new Error("Dataset annotation method not found");
          }

          if (!splitMethod) {
            throw new Error("Dataset split method not found");
          }

          // TODO: แค่ชั่วคราว เอาไว้มาแก้ให้ไม่ Hard Code ทีหลัง OK?
          const filterImages = images.map(({ url, annotation }) => {
            const updatedUrl = url.includes("http://localhost:4566")
              ? url.replace(
                  "http://localhost:4566",
                  "http://host.docker.internal:4566"
                )
              : url;

            return { url: updatedUrl, annotation };
          });

          const { trainData, testData, validData } =
            splitMethod === "default"
              ? defaultSplit(
                  filterImages,
                  train / 100,
                  test / 100,
                  valid / 100,
                  labels
                )
              : stratifiedSplit(
                  filterImages,
                  train / 100,
                  test / 100,
                  valid / 100,
                  labels
                );

          const responseCreateDataset = await axios.post(
            `${config.PYTHON_SERVER_URL}/dataset`,
            {
              type: annotationMethod,
              labels,
              train_data: trainData,
              test_data: testData,
              valid_data: validData,
            }
          );

          if (responseCreateDataset.status !== 200) {
            throw new Error(
              `Failed to create dataset on Python Server: ${responseCreateDataset.statusText}`
            );
          }

          const responseImagePreprocessingAndAugmentation = await axios.post(
            `${config.PYTHON_SERVER_URL}/dataset-config`,
            {
              type: annotationMethod,
              preprocess: trainingData.imagePreprocessing?.data,
              augmentation: trainingData.augmentation?.data,
            }
          );

          if (responseImagePreprocessingAndAugmentation.status !== 200) {
            throw new Error(
              `Failed to preprocess and augment images on Python Server: ${responseImagePreprocessingAndAugmentation.statusText}`
            );
          }

          // ✅ Update Status Into "training"
          await trainingRepository.updateById(
            trainingData.workflow.id,
            trainingData.id,
            { status: "training" }
          );

          let responseTraining: AxiosResponse<any, any>;
          let fileType: string;

          if (trainingData.dataset.annotationMethod === "classification") {
            if (trainingData.machineLearningModel) {
              responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-ml`,
                {
                  model: trainingData.machineLearningModel,
                  featex: trainingData.featureExtraction?.data,
                },
                {
                  responseType: "arraybuffer",
                }
              );
              fileType = "pkl";
            } else if (trainingData.preTrainedModel) {
              responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-dl-cls-pt`,
                {
                  model: trainingData.preTrainedModel,
                  training: trainingData.hyperparameter,
                },
                {
                  responseType: "arraybuffer",
                }
              );
              fileType = "h5";
            } else if (trainingData.customModel) {
              responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-dl-cls-construct`,
                {
                  model: trainingData.customModel,
                  training: trainingData.hyperparameter,
                  featex: trainingData.featureExtraction?.data,
                },
                {
                  responseType: "arraybuffer",
                }
              );
              fileType = "h5";
            } else {
              throw new Error(
                `Model for ${trainingData.dataset.annotationMethod} not found.`
              );
            }
          } else if (
            trainingData.dataset.annotationMethod === "object_detection"
          ) {
            if (trainingData.preTrainedModel) {
              responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-yolo-pt`,
                {
                  type: "object_detection",
                  model: trainingData.preTrainedModel,
                  training: trainingData.hyperparameter,
                },
                {
                  responseType: "arraybuffer",
                }
              );
              fileType = "pt";
            } else if (trainingData.customModel) {
              responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-dl-od-construct`,
                {
                  model: trainingData.customModel,
                  training: trainingData.hyperparameter,
                  featex: trainingData.featureExtraction
                    ? trainingData.featureExtraction.data
                    : undefined,
                },
                {
                  responseType: "arraybuffer",
                }
              );
              fileType = "h5";
            } else {
              throw new Error(
                `Model for ${trainingData.dataset.annotationMethod} not found.`
              );
            }
          } else if (trainingData.dataset.annotationMethod === "segmentation") {
            if (trainingData.preTrainedModel) {
              responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-yolo-pt`,
                {
                  type: "segmentation",
                  model: trainingData.preTrainedModel,
                  training: trainingData.hyperparameter,
                },
                {
                  responseType: "arraybuffer",
                }
              );
              fileType = "pt";
            } else {
              throw new Error(
                `Model for ${trainingData.dataset.annotationMethod} not found.`
              );
            }
          } else {
            throw new Error("Annotation method in dataset not matching.");
          }

          if (responseTraining.status !== 200) {
            throw new Error(
              `Failed to train model on Python Server: ${responseTraining.statusText}`
            );
          }

          const filePath = `trainings/${trainingData.id}/model.${fileType}`;

          await uploadFile(
            filePath,
            Buffer.from(responseTraining.data),
            "application/octet-stream"
          );

          // ✅ Update Status Into "completed"
          await trainingRepository.updateById(
            trainingData.workflow.id,
            trainingData.id,
            {
              status: "completed",
              trainedModelPath: filePath,
              errorMessage: null,
            }
          );
          queueLogger.info(`✅ Training completed: ${trainingData.queueId}`);
        } catch (error) {
          if (error instanceof Error) {
            queueLogger.error(
              `❌ Training failed: ${trainingData.queueId} with error: ${error.message}`
            );

            // TODO: แก้ created ให้กลายเป็น completed หลังทำเสร็จทั้งหมด
            // ✅ Update Status Into "failed"
            await trainingRepository.updateById(
              trainingData.workflow.id,
              trainingData.id,
              { status: "failed", errorMessage: error.message }
            );
          }
        } finally {
          // ✅ Delete Request From Queue
          channel.ack(msg);
        }
      }
    },
    { noAck: false }
  );
};

const startWorker = async () => {
  try {
    logger.info("🔄 Initializing Worker...");

    await connectRedis();
    await retryConnection(connectRabbitMQ, "RabbitMQ", 10);
    await connectDatabase();
    await retryConnection(connectS3, "S3", 10);

    await startTrainingWorker();

    logger.info("🐰 Worker started successfully! 🚀");
  } catch (error) {
    logger.error("❌ Failed to start Worker:", error);
    process.exit(1);
  }
};

startWorker();
