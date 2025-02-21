import { Elysia } from "elysia";
import { workflowService, trainingService } from "@/config/dependencies";
import { userMiddleware } from "@/middleware/authMiddleware";
import { paginationDto } from "@/domains/dtos/pagination";
import {
  createWorkflowDto,
  updateWorkflowDto,
  workflowResponseDto,
  workflowsResponseDto,
} from "@/domains/dtos/workflow";
import {
  createTrainingDto,
  updateTrainingDto,
  trainingResponseDto,
  trainingsResponseDto,
  startTrainingResponseDto,
} from "@/domains/dtos/training";

export const workflow = new Elysia({
  name: "workflow-controller",
  prefix: "/workflows",
  detail: {
    tags: ["Workflow"],
  },
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("workflowService", workflowService)
  .decorate("trainingService", trainingService)
  .guard({ response: workflowResponseDto }, (app) =>
    app
      .post(
        "/",
        async ({ user, body, workflowService }) => {
          return workflowService.createWorkflow({
            ...body,
            userId: user.id,
          });
        },
        { body: createWorkflowDto }
      )
      .get(
        "/",
        async ({ user, query, workflowService }) => {
          return workflowService.getWorkflowsByUserId(user.id, query);
        },
        { query: paginationDto, response: workflowsResponseDto }
      )
      .get("/:id", async ({ user, params, workflowService }) => {
        return workflowService.getWorkflowById(user.id, params.id);
      })
      .put(
        "/:id",
        async ({ user, params, body, workflowService }) => {
          return workflowService.updateWorkflow(user.id, params.id, body);
        },
        { body: updateWorkflowDto }
      )
      .delete("/:id", async ({ user, params, workflowService }) => {
        return workflowService.deleteWorkflow(user.id, params.id);
      })
  )
  .group("/:id/trainings", (app) =>
    app
      .post(
        "/",
        async ({ user, params, body, trainingService }) => {
          return trainingService.createTraining(user.id, params.id, body);
        },
        { body: createTrainingDto }
      )
      .get(
        "/",
        async ({ user, params, query, trainingService }) => {
          return trainingService.getTrainingsByWorkflowId(
            user.id,
            params.id,
            query
          );
        },
        { query: paginationDto }
      )
      .get("/:trainingId", async ({ user, params, trainingService }) => {
        return trainingService.getTrainingById(
          user.id,
          params.id,
          params.trainingId
        );
      })
      .put(
        "/:trainingId",
        async ({ user, params, body, trainingService }) => {
          return trainingService.updateTraining(
            user.id,
            params.id,
            params.trainingId,
            body
          );
        },
        { body: updateTrainingDto }
      )
      .delete("/:trainingId", async ({ user, params, trainingService }) => {
        return trainingService.deleteTraining(
          user.id,
          params.id,
          params.trainingId
        );
      })
      .post(
        "/:trainingId/start",
        async ({ user, params, trainingService }) => {
          return trainingService.startTraining(
            user.id,
            params.id,
            params.trainingId
          );
        },
        { response: startTrainingResponseDto }
      )
  );
