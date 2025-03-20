import {
  connectRabbitMQ,
  getRabbitMQChannel,
} from "@/infrastructures/rabbitmq/connection";
import { imageService, trainingService } from "@/config/dependencies";
import { logger, queueLogger } from "@/config/logger";
import { config } from "@/config/env";
import type { TrainingResponseDto } from "@/domains/dtos/training";
import { retryConnection } from "@/utils/retry";
import { connectRedis } from "@/infrastructures/redis/connection";
import { connectDatabase } from "@/infrastructures/database/connection";
import { connectS3 } from "@/infrastructures/s3/connection";
import axios from "axios";

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

  channel.consume(
    config.RABBITMQ_TRAINING_QUEUE_NAME,
    async (msg) => {
      if (msg) {
        const trainingData = JSON.parse(
          msg.content.toString()
        ) as TrainingResponseDto;

        queueLogger.info(`🚀 Processing training: ${trainingData.queueId}`);

        try {
          // ✅ Update Status Into "running"
          await trainingService.updateStatus(trainingData.id, "running");

          // TODO: เริ่มตรงนี้ตาม Note

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

          const filterImages = images.map(({ url, annotation }) => {
            return { url, annotation };
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

          if (trainingData.dataset.annotationMethod === "classification") {
            if (trainingData.machineLearningModel) {
              const responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-ml`,
                {
                  training: trainingData.hyperparameter,
                  featex: trainingData.featureExtraction?.data,
                }
              );

              if (responseTraining.status !== 200) {
                throw new Error(
                  `Failed to train model on Python Server: ${responseTraining.statusText}`
                );
              }
            } else if (trainingData.preTrainedModel) {
              const responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-dl-cls-pt`,
                {
                  model: trainingData.preTrainedModel,
                  training: trainingData.hyperparameter,
                }
              );

              if (responseTraining.status !== 200) {
                throw new Error(
                  `Failed to train model on Python Server: ${responseTraining.statusText}`
                );
              }
            } else if (trainingData.customModel) {
              const responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-dl-cls-construct`,
                {
                  model: trainingData.customModel,
                  training: trainingData.hyperparameter,
                  featex: trainingData.featureExtraction?.data,
                }
              );

              if (responseTraining.status !== 200) {
                throw new Error(
                  `Failed to train model on Python Server: ${responseTraining.statusText}`
                );
              }
            } else {
              throw new Error(
                `Model for ${trainingData.dataset.annotationMethod} not found.`
              );
            }
          } else if (
            trainingData.dataset.annotationMethod === "object_detection"
          ) {
            if (trainingData.preTrainedModel) {
              const responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-yolo-pt`,
                {
                  type: "object_detection",
                  model: trainingData.preTrainedModel,
                  training: trainingData.hyperparameter,
                }
              );

              if (responseTraining.status !== 200) {
                throw new Error(
                  `Failed to train model on Python Server: ${responseTraining.statusText}`
                );
              }
            } else if (trainingData.customModel) {
              const responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-dl-od-construct`,
                {
                  model: trainingData.customModel,
                  training: trainingData.hyperparameter,
                  featex: trainingData.featureExtraction
                    ? trainingData.featureExtraction.data
                    : undefined,
                }
              );

              if (responseTraining.status !== 200) {
                throw new Error(
                  `Failed to train model on Python Server: ${responseTraining.statusText}`
                );
              }
            } else {
              throw new Error(
                `Model for ${trainingData.dataset.annotationMethod} not found.`
              );
            }
          } else if (trainingData.dataset.annotationMethod === "segmentation") {
            if (trainingData.preTrainedModel) {
              const responseTraining = await axios.post(
                `${config.PYTHON_SERVER_URL}/training-yolo-pt`,
                {
                  type: "segmentation",
                  model: trainingData.preTrainedModel,
                  training: trainingData.hyperparameter,
                }
              );

              if (responseTraining.status !== 200) {
                throw new Error(
                  `Failed to train model on Python Server: ${responseTraining.statusText}`
                );
              }
            } else {
              throw new Error(
                `Model for ${trainingData.dataset.annotationMethod} not found.`
              );
            }
          } else {
            throw new Error("Annotation method in dataset not matching.");
          }

          // ✅ Update Status Into "completed"
          await trainingService.updateStatus(trainingData.id, "completed");
          queueLogger.info(`✅ Training completed: ${trainingData.queueId}`);
        } catch (error) {
          queueLogger.error(
            `❌ Training failed: ${trainingData.queueId}`,
            error
          );

          // ✅ Update Status Into "failed"
          await trainingService.updateStatus(trainingData.id, "failed");
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
