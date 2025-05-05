import {
  connectRabbitMQ,
  getRabbitMQChannel,
} from "@/infrastructures/rabbitmq/connection";
import {
  imageService,
  trainingRepository,
  modelInferenceRepository,
} from "@/config/dependencies";
import { logger, queueLogger } from "@/config/logger";
import { config } from "@/config/env";
import type { TrainingResponseDto } from "@/domains/dtos/training";
import type {
  ModelInferenceResponseDto,
  UploadModelConfigDto,
} from "@/domains/dtos/modelInference";
import { retryConnection } from "@/utils/retry";
import { connectRedis } from "@/infrastructures/redis/connection";
import { connectDatabase } from "@/infrastructures/database/connection";
import { connectS3 } from "@/infrastructures/s3/connection";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { defaultSplit, isLabels, stratifiedSplit } from "@/utils/split-data";
import {
  deleteFile,
  generatePresignedUrl,
  uploadFile,
} from "@/infrastructures/s3/s3";

type WorkerTrainingData = {
  type: "training";
  data: TrainingResponseDto;
};

type WorkerInferenceData = {
  type: "inference";
  data: ModelInferenceResponseDto;
};

type WorkerData = WorkerTrainingData | WorkerInferenceData;

const isUploadModelConfig = (data: unknown): data is UploadModelConfigDto => {
  const testData = data as UploadModelConfigDto;
  return testData.workflow !== undefined && testData.training !== undefined;
};

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
        const workerData = JSON.parse(msg.content.toString()) as WorkerData;

        if (workerData.type === "training") {
          const { data } = workerData;
          queueLogger.info(`🚀 Processing training: ${data.queueId}`);

          try {
            // ✅ Update Status Into "prepare_dataset"
            await trainingRepository.updateById(data.workflow.id, data.id, {
              status: "prepare_dataset",
            });

            if (!data.dataset) {
              throw new Error("Training dataset not found");
            }

            const { data: images } = await imageService.getImagesByDatasetId(
              data.workflow.userId,
              data.dataset.id,
              { limit: 1000 },
              "server"
            );

            const {
              train,
              test,
              valid,
              labels,
              annotationMethod,
              splitMethod,
            } = data.dataset;

            if (!train || !test || !valid) {
              throw new Error("Train/Test/Valid ratio in dataset not found");
            }

            if (!labels) {
              throw new Error("Dataset labels not found");
            }

            if (!isLabels(labels)) {
              throw new Error("Format of dataset labels not matching");
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
                labels: labels.map((label) => label.name),
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

            // ✅ Set Default Of Number In Augmentation Data If Not Exists
            let augmentationData = undefined;

            if (data.augmentation) {
              augmentationData = data.augmentation.data;
              if (typeof augmentationData === "object") {
                if (augmentationData && !("number" in augmentationData)) {
                  augmentationData = {
                    ...augmentationData,
                    number: trainData.length * 2,
                  };
                }
              }
            }

            const responseImagePreprocessingAndAugmentation = await axios.post(
              `${config.PYTHON_SERVER_URL}/dataset-config`,
              {
                type: annotationMethod,
                preprocess: data.imagePreprocessing?.data,
                augmentation: augmentationData,
              }
            );

            if (responseImagePreprocessingAndAugmentation.status !== 200) {
              throw new Error(
                `Failed to preprocess and augment images on Python Server: ${responseImagePreprocessingAndAugmentation.statusText}`
              );
            }

            // ✅ Update Status Into "training"
            await trainingRepository.updateById(data.workflow.id, data.id, {
              status: "training",
            });

            let trainingResponse: AxiosResponse<any, any>;
            let evaluationResponse: AxiosResponse<any, any>;
            let fileType: string;

            if (data.dataset.annotationMethod === "classification") {
              if (data.machineLearningModel) {
                trainingResponse = await axios.post(
                  `${config.PYTHON_SERVER_URL}/training-ml`,
                  {
                    model: data.machineLearningModel,
                    featex: data.featureExtraction?.data,
                  },
                  {
                    responseType: "arraybuffer",
                  }
                );
                fileType = "pkl";
              } else if (data.preTrainedModel) {
                trainingResponse = await axios.post(
                  `${config.PYTHON_SERVER_URL}/training-dl-cls-pt`,
                  {
                    model: data.preTrainedModel,
                    training: data.hyperparameter,
                  },
                  {
                    responseType: "arraybuffer",
                  }
                );
                fileType = "h5";
              } else if (data.customModel) {
                trainingResponse = await axios.post(
                  `${config.PYTHON_SERVER_URL}/training-dl-cls-construct`,
                  {
                    model: data.customModel.data,
                    training: data.hyperparameter,
                    featex: data.featureExtraction?.data,
                  },
                  {
                    responseType: "arraybuffer",
                  }
                );
                fileType = "h5";
              } else {
                throw new Error(
                  `Model for ${data.dataset.annotationMethod} not found.`
                );
              }
              evaluationResponse = await axios.get(
                `${config.PYTHON_SERVER_URL}/evaluation?workflow=cls`
              );
            } else if (data.dataset.annotationMethod === "object_detection") {
              if (data.preTrainedModel) {
                trainingResponse = await axios.post(
                  `${config.PYTHON_SERVER_URL}/training-yolo-pt`,
                  {
                    type: "object_detection",
                    model: data.preTrainedModel,
                    training: data.hyperparameter,
                  },
                  {
                    responseType: "arraybuffer",
                  }
                );
                evaluationResponse = await axios.get(
                  `${config.PYTHON_SERVER_URL}/evaluation?workflow=od&yolo=${data.preTrainedModel}`
                );
                fileType = "pt";
              } else if (data.customModel) {
                trainingResponse = await axios.post(
                  `${config.PYTHON_SERVER_URL}/training-dl-od-construct`,
                  {
                    model: data.customModel.data,
                    training: data.hyperparameter,
                    featex: data.featureExtraction
                      ? data.featureExtraction.data
                      : undefined,
                  },
                  {
                    responseType: "arraybuffer",
                  }
                );
                evaluationResponse = await axios.get(
                  `${config.PYTHON_SERVER_URL}/evaluation?workflow=od`
                );
                fileType = "h5";
              } else {
                throw new Error(
                  `Model for ${data.dataset.annotationMethod} not found.`
                );
              }
            } else if (data.dataset.annotationMethod === "segmentation") {
              if (data.preTrainedModel) {
                trainingResponse = await axios.post(
                  `${config.PYTHON_SERVER_URL}/training-yolo-pt`,
                  {
                    type: "segmentation",
                    model: data.preTrainedModel,
                    training: data.hyperparameter,
                  },
                  {
                    responseType: "arraybuffer",
                  }
                );
                evaluationResponse = await axios.get(
                  `${config.PYTHON_SERVER_URL}/evaluation?workflow=seg&yolo=${data.preTrainedModel}`
                );
                fileType = "pt";
              } else {
                throw new Error(
                  `Model for ${data.dataset.annotationMethod} not found.`
                );
              }
            } else {
              throw new Error("Annotation method in dataset not matching.");
            }

            if (trainingResponse.status !== 200) {
              throw new Error(
                `Failed to train model on Python Server: ${trainingResponse.statusText}`
              );
            }

            if (evaluationResponse.status !== 200) {
              throw new Error(
                `Failed to get evaluation on Python Server: ${evaluationResponse.statusText}`
              );
            }

            const filePath = `trainings/${data.id}/model.${fileType}`;

            await uploadFile(
              filePath,
              Buffer.from(trainingResponse.data),
              "application/octet-stream"
            );

            // ✅ Update Status Into "completed"
            await trainingRepository.updateById(data.workflow.id, data.id, {
              status: "completed",
              trainedModelPath: filePath,
              evaluation: evaluationResponse.data,
              errorMessage: null,
            });
            queueLogger.info(`✅ Training completed: ${data.queueId}`);
          } catch (error) {
            let errorMessage = "Unknown error occurred.";
            if (error instanceof AxiosError) {
              const message = error.response?.data;

              if (typeof message === "string") {
                errorMessage = message;
              } else if (typeof message === "object") {
                errorMessage = JSON.stringify(message);
              }
            } else if (error instanceof Error) {
              errorMessage = error.message;
            }

            queueLogger.error(
              `❌ Training failed: ${data.queueId} with error: ${errorMessage}`
            );

            // ✅ Update Status Into "failed"
            await trainingRepository.updateById(data.workflow.id, data.id, {
              status: "failed",
              errorMessage: errorMessage,
              retryCount: data.retryCount + 1,
            });
          } finally {
            // ✅ Delete Request From Queue
            channel.ack(msg);
          }
        } else if (workerData.type === "inference") {
          const { data } = workerData;
          queueLogger.info(`🚀 Processing inference: ${data.queueId}`);

          try {
            // ✅ Update Status Into "running"
            await modelInferenceRepository.updateById(data.userId, data.id, {
              status: "running",
            });

            const imagePath = generatePresignedUrl(data.imagePath, "server");

            let inferenceResponse: AxiosResponse<any, any>;
            let annotationData: object;

            // ✅ In Case Use Model From Training
            if (data.trainingId) {
              const trainingsData =
                await trainingRepository.findModelInferenceInfoById(
                  data.trainingId
                );
              if (trainingsData.length !== 0) {
                const trainingData = trainingsData[0];
                if (trainingData.trainedModelPath) {
                  const modelFilePath = generatePresignedUrl(
                    trainingData.trainedModelPath,
                    "server"
                  );
                  if (trainingData.workflow.type === "classification") {
                    const modelType = trainingData.machineLearningModel
                      ? "ml"
                      : "dl_cls";
                    inferenceResponse = await axios.post(
                      `${config.PYTHON_SERVER_URL}/use-model`,
                      {
                        type: modelType,
                        img: imagePath,
                        model: modelFilePath,
                      }
                    );
                  } else if (
                    trainingData.workflow.type === "object_detection"
                  ) {
                    if (trainingData.preTrainedModel) {
                      inferenceResponse = await axios.post(
                        `${config.PYTHON_SERVER_URL}/use-model`,
                        {
                          type: "dl_od_pt",
                          version: trainingData.preTrainedModel,
                          img: imagePath,
                          model: modelFilePath,
                        }
                      );
                    } else {
                      inferenceResponse = await axios.post(
                        `${config.PYTHON_SERVER_URL}/use-model`,
                        {
                          type: "dl_od_con",
                          img: imagePath,
                          model: modelFilePath,
                        }
                      );
                    }
                  } else if (trainingData.workflow.type === "segmentation") {
                    if (trainingData.preTrainedModel) {
                      inferenceResponse = await axios.post(
                        `${config.PYTHON_SERVER_URL}/use-model`,
                        {
                          type: "dl_seg",
                          version: trainingData.preTrainedModel,
                          img: imagePath,
                          model: modelFilePath,
                        }
                      );
                    } else {
                      throw new Error("Invalid model type for segmentation.");
                    }
                  } else {
                    throw new Error(
                      `Invalid type for ${trainingData.workflow.type}.`
                    );
                  }

                  if (inferenceResponse.status !== 200) {
                    throw new Error(
                      `Inference Failed: ${inferenceResponse.statusText}`
                    );
                  }

                  if (!trainingData.dataset) {
                    throw new Error(
                      `Dataset From Training ID: ${data.trainingId} Don't Have Not Found`
                    );
                  }

                  const labels = trainingData.dataset.labels;

                  if (!isLabels(labels)) {
                    throw new Error("Format of dataset labels not matching");
                  }

                  if (trainingData.workflow.type === "classification") {
                    const index: number = inferenceResponse.data.prediction;
                    annotationData = {
                      label: labels.sort((a, b) =>
                        a.name.localeCompare(b.name)
                      )[index].name,
                    };
                  } else if (
                    trainingData.workflow.type === "object_detection"
                  ) {
                    annotationData = inferenceResponse.data.prediction.map(
                      (d: any) => {
                        return {
                          ...d,
                          label: labels[d.label].name,
                        };
                      }
                    );
                  } else if (trainingData.workflow.type === "segmentation") {
                    annotationData = inferenceResponse.data.prediction.map(
                      (d: any) => {
                        return {
                          ...d,
                          label: labels[d.label].name,
                        };
                      }
                    );
                  } else {
                    annotationData = {};
                  }
                } else {
                  throw new Error(
                    `Training ID: ${data.trainingId} Don't Have Model`
                  );
                }
              } else {
                throw new Error(`Invalid Training ID: ${data.trainingId}`);
              }
            } else if (data.modelPath) {
              const modelFilePath = generatePresignedUrl(
                data.modelPath,
                "server"
              );
              if (isUploadModelConfig(data.modelConfig)) {
                let modelType = "";

                if (data.modelConfig.workflow === "classification") {
                  if (data.modelConfig.training === "machine_learning") {
                    modelType = "ml";
                  } else {
                    modelType = "dl_cls";
                  }
                } else if (data.modelConfig.workflow === "object_detection") {
                  if (data.modelConfig.training === "pre_trained") {
                    modelType = "dl_od_pt";
                  } else {
                    modelType = "dl_od_con";
                  }
                } else {
                  modelType = "dl_seg";
                }
                inferenceResponse = await axios.post(
                  `${config.PYTHON_SERVER_URL}/use-model`,
                  {
                    type: modelType,
                    version: data.modelConfig.version,
                    img: imagePath,
                    model: modelFilePath,
                  }
                );

                annotationData = inferenceResponse.data;
                if (data.modelConfig.workflow === "classification") {
                  const index: number = inferenceResponse.data.prediction;
                  annotationData = {
                    label: index,
                  };
                } else if (data.modelConfig.workflow === "object_detection") {
                  annotationData = inferenceResponse.data.prediction;
                } else if (data.modelConfig.workflow === "segmentation") {
                  annotationData = inferenceResponse.data.prediction;
                } else {
                  annotationData = {};
                }

                if (inferenceResponse.status !== 200) {
                  throw new Error(
                    `Inference Failed: ${inferenceResponse.statusText}`
                  );
                }
              } else {
                throw new Error(
                  "Invalid Request Don't Have Upload Model Config"
                );
              }

              // ✅ Delete Model From Cloud (Save Memory)
              await deleteFile(data.modelPath);
            } else {
              throw new Error(
                "Invalid Request, Don't Have Model To Inference."
              );
            }

            await modelInferenceRepository.updateById(data.userId, data.id, {
              annotation: annotationData,
              modelPath: null,
              status: "completed",
              errorMessage: null,
            });

            queueLogger.info(`✅ Inference completed: ${data.queueId}`);
          } catch (error) {
            let errorMessage = "Unknown error occurred.";
            if (error instanceof AxiosError) {
              const message = error.response?.data;

              if (typeof message === "string") {
                errorMessage = message;
              } else if (typeof message === "object") {
                errorMessage = JSON.stringify(message);
              }
            } else if (error instanceof Error) {
              errorMessage = error.message;
            }
            queueLogger.error(
              `❌ Inference failed: ${data.queueId} with error: ${errorMessage}`
            );

            await modelInferenceRepository.updateById(data.userId, data.id, {
              modelPath: null,
              status: "failed",
              errorMessage: errorMessage,
              retryCount: data.retryCount + 1,
            });

            // ✅ Delete Model From Cloud (Save Memory)
            if (data.modelPath) {
              await deleteFile(data.modelPath);
            }
          } finally {
            channel.ack(msg);
          }
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
