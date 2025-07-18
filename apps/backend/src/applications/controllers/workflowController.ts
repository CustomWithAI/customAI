import {
  logService,
  trainingService,
  workflowService,
  activityLogService,
} from "@/config/dependencies";
import { activityLogsResponseDto } from "@/domains/dtos/activityLog";
import { deleteLogsResponseDto, logsResponseDto } from "@/domains/dtos/logs";
import { paginationDto } from "@/domains/dtos/pagination";
import {
  createTrainingDto,
  defaultTrainingResponseDto,
  trainingResponseDto,
  trainingsResponseDto,
  updateTrainingDto,
} from "@/domains/dtos/training";
import {
  createWorkflowDto,
  updateWorkflowDto,
  workflowResponseDto,
  workflowsResponseDto,
} from "@/domains/dtos/workflow";
import { userMiddleware } from "@/middleware/authMiddleware";
import { emit } from "@/utils/emit";
import { Elysia } from "elysia";

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
  .decorate("logService", logService)
  .decorate("activityLogService", activityLogService)
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
      .get(
        "/:id/activity-logs",
        async ({ params, activityLogService, query }) => {
          return activityLogService.getByWorkflowId(params.id, query);
        },
        { query: paginationDto, response: activityLogsResponseDto }
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
        { body: createTrainingDto, response: defaultTrainingResponseDto }
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
        { query: paginationDto, response: trainingsResponseDto }
      )
      .get(
        "desc-version",
        async ({ user, params, query, trainingService }) => {
          return trainingService.getTrainingsByWorkflowId(
            user.id,
            params.id,
            query
          );
        },
        { query: paginationDto, response: trainingsResponseDto }
      )
      .get(
        "/:trainingId",
        async ({ user, params, trainingService }) => {
          return trainingService.getTrainingById(
            user.id,
            params.id,
            params.trainingId
          );
        },
        { response: trainingResponseDto }
      )
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
        { body: updateTrainingDto, response: defaultTrainingResponseDto }
      )
      .delete(
        "/:trainingId",
        async ({ user, params, trainingService }) => {
          return trainingService.deleteTraining(
            user.id,
            params.id,
            params.trainingId
          );
        },
        { response: defaultTrainingResponseDto }
      )
      .post(
        "/:trainingId/start",
        async function* ({ user, params, trainingService, set }) {
          try {
            const trainingStream = trainingService.startTraining(
              user.id,
              params.id,
              params.trainingId
            );

            for await (const message of trainingStream) {
              yield message;
            }
            return;
          } catch (error) {
            yield emit(
              (error as any)?.response?.message || "unexpected error",
              false
            );
            return;
          }
        }
      )
      .post(
        "/:trainingId/set-default",
        async ({ user, params, trainingService }) => {
          return trainingService.setTrainingToDefault(
            user.id,
            params.id,
            params.trainingId
          );
        },
        { response: defaultTrainingResponseDto }
      )
      .get(
        "/default",
        async ({ user, params, trainingService }) => {
          return trainingService.getTrainingByDefault(user.id, params.id);
        },
        { response: trainingResponseDto }
      )
      .post(
        "/:trainingId/clone",
        async ({ user, params, trainingService }) => {
          return trainingService.cloneTraining(
            user.id,
            params.id,
            params.trainingId
          );
        },
        { response: defaultTrainingResponseDto }
      )
      .get(
        "/:trainingId/logs",
        async ({ query, params, logService }) => {
          return logService.getLogsByTrainingId(params.trainingId, query);
        },
        { query: paginationDto, response: logsResponseDto }
      )
      .delete(
        "/:trainingId/logs",
        async ({ params, logService }) => {
          return logService.deleteLogsByTrainingId(params.trainingId);
        },
        { response: deleteLogsResponseDto }
      )
  );
