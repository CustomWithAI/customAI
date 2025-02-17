import { Elysia } from "elysia";
import { featureSelectionService } from "@/config/dependencies";
import {
  createFeatureSelectionDto,
  updateFeatureSelectionDto,
} from "@/domains/dtos/featureSelection";
import { userMiddleware } from "@/middleware/authMiddleware";
import { paginationDto } from "@/domains/dtos/pagination";

export const featureSelection = new Elysia({
  name: "feature-selection-controller",
  prefix: "feature-selections",
  detail: {
    tags: ["Feature Selection"],
  },
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("featureSelectionService", featureSelectionService)
  .post(
    "/",
    async ({ user, body, featureSelectionService }) => {
      return featureSelectionService.createFeatureSelection({
        ...body,
        userId: user.id,
      });
    },
    { body: createFeatureSelectionDto }
  )
  .get(
    "/",
    async ({ user, query, featureSelectionService }) => {
      return featureSelectionService.getFeatureSelectionsByUserId(
        user.id,
        query
      );
    },
    { query: paginationDto }
  )
  .get("/:id", async ({ user, params, featureSelectionService }) => {
    return featureSelectionService.getFeatureSelectionById(user.id, params.id);
  })
  .put(
    "/:id",
    async ({ user, params, body, featureSelectionService }) => {
      return featureSelectionService.updateFeatureSelection(
        user.id,
        params.id,
        body
      );
    },
    { body: updateFeatureSelectionDto }
  )
  .delete("/:id", async ({ user, params, featureSelectionService }) => {
    return featureSelectionService.deleteFeatureSelection(user.id, params.id);
  });
