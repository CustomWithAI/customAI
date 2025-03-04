import type { TrainingRepository } from "@/applications/repositories/trainingRepository";
import type { WorkflowRepository } from "@/applications/repositories/workflowRepository";
import { sendToRabbitMQ } from "@/infrastructures/rabbitmq/queue";
import { NotFoundError, InternalServerError } from "elysia";
import type { trainings } from "@/domains/schema/trainings";
import type { PaginationParams } from "@/utils/db-type";
import type { CreateTrainingDto } from "@/domains/dtos/training";

export class TrainingService {
  public constructor(
    private repository: TrainingRepository,
    private workflowRepository: WorkflowRepository
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

    const result = await this.repository.create({
      ...data,
      workflowId,
      hyperparameter: {},
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
    return this.repository.findByWorkflowId(workflowId, pagination);
  }

  public async getTrainingById(userId: string, workflowId: string, id: string) {
    await this.ensureWorkflowExists(userId, workflowId);

    const result = await this.repository.findById(workflowId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }
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

    // TODO: Should validate this training have dataset or not and check if "failed" before or not

    const training = await this.repository.findById(workflowId, id);
    if (training.length === 0) {
      throw new NotFoundError(`Training not found: ${id}`);
    }
    if (training[0].status !== "created") {
      throw new InternalServerError("Training has already started");
    }

    const queueId = await sendToRabbitMQ(training[0]);

    await this.repository.updateStatus(id, "pending", queueId);

    return { message: "Training added to queue", queueId };
  }
}
