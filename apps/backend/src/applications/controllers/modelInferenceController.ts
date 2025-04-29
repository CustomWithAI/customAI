import { Elysia } from "elysia";
import { modelInferenceService } from "@/config/dependencies";
import { userMiddleware } from "@/middleware/authMiddleware";
import {
  createModelInferenceDto,
  createUploadModelInferenceDto,
  deleteModelInferenceResponseDto,
  modelInferenceResponseDto,
  modelInferencesResponseDto,
} from "@/domains/dtos/modelInference";
import { paginationDto } from "@/domains/dtos/pagination";

export const modelInference = new Elysia({
  name: "model-inference-controller",
  prefix: "/model-inferences",
  detail: {
    tags: ["Model Inference"],
  },
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("modelInferenceService", modelInferenceService)
  .guard({ response: modelInferenceResponseDto }, (app) =>
    app
      .post(
        "/",
        async ({ user, body, modelInferenceService }) => {
          return modelInferenceService.createFromUpload(user.id, body);
        },
        {
          body: createUploadModelInferenceDto,
        }
      )
      .get(
        "/",
        async ({ user, query, modelInferenceService }) => {
          return modelInferenceService.getModelInferencesByUserId(
            user.id,
            query
          );
        },
        { query: paginationDto, response: modelInferencesResponseDto }
      )
      .get("/:id", async ({ user, params, modelInferenceService }) => {
        return modelInferenceService.getModelInferenceById(user.id, params.id);
      })
      .delete(
        "/:id",
        async ({ user, params, modelInferenceService }) => {
          return modelInferenceService.deleteModelInference(user.id, params.id);
        },
        { response: deleteModelInferenceResponseDto }
      )
  )
  .group("/workflows/:workflowId", (app) =>
    app
      .post(
        "/",
        async ({ user, params, body, modelInferenceService }) => {
          return modelInferenceService.createFromWorkflow(
            user.id,
            params.workflowId,
            body
          );
        },
        { body: createModelInferenceDto, response: modelInferenceResponseDto }
      )
      .post(
        "/trainings/:trainingId",
        async ({ user, params, body, modelInferenceService }) => {
          return modelInferenceService.createFromTraining(
            user.id,
            params.workflowId,
            params.trainingId,
            body
          );
        },
        { body: createModelInferenceDto, response: modelInferenceResponseDto }
      )
  );
