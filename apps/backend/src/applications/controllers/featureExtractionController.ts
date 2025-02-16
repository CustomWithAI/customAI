import { Elysia } from "elysia";
import { featureExtractionService } from "@/config/dependencies";
import {
  createFeatureExtractionDto,
  updateFeatureExtractionDto,
} from "@/domains/dtos/featureExtraction";
import { userMiddleware } from "@/middleware/authMiddleware";
import { paginationDto } from "@/domains/dtos/pagination";

export const featureExtraction = new Elysia({
  name: "feature-extraction-controller",
  prefix: "feature-extractions",
  detail: {
    tags: ["Feature Extraction"],
  },
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("featureExtractionService", featureExtractionService)
  .post(
    "/",
    async ({ user, body, featureExtractionService }) => {
      return featureExtractionService.createFeatureExtraction({
        ...body,
        userId: user.id,
      });
    },
    { body: createFeatureExtractionDto }
  )
  .get(
    "/",
    async ({ user, query, featureExtractionService }) => {
      return featureExtractionService.getFeatureExtractionsByUserId(
        user.id,
        query
      );
    },
    { query: paginationDto }
  )
  .get("/:id", async ({ user, params, featureExtractionService }) => {
    return featureExtractionService.getFeatureExtractionById(
      user.id,
      params.id
    );
  })
  .put(
    "/:id",
    async ({ user, params, body, featureExtractionService }) => {
      return featureExtractionService.updateFeatureExtraction(
        user.id,
        params.id,
        body
      );
    },
    { body: updateFeatureExtractionDto }
  )
  .delete("/:id", async ({ user, params, featureExtractionService }) => {
    return featureExtractionService.deleteFeatureExtraction(user.id, params.id);
  });
