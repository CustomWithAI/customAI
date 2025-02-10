import { Elysia } from "elysia";
import { augmentationService } from "@/config/dependencies";
import {
  augmentationResponseDto,
  augmentationsResponseDto,
  createAugmentationDto,
  updateAugmentationDto,
} from "@/domains/dtos/augmentation";
import { userMiddleware } from "@/middleware/authMiddleware";
import { paginationDto } from "@/domains/dtos/pagination";

export const augmentation = new Elysia({
  name: "augmentation-controller",
  prefix: "augmentations",
  detail: {
    tags: ["Augmentation"],
  },
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("augmentationService", augmentationService)
  .guard({ response: augmentationResponseDto }, (app) =>
    app
      .post(
        "/",
        async ({ user, body, augmentationService }) => {
          return augmentationService.createAugmentation({
            ...body,
            userId: user.id,
          });
        },
        { body: createAugmentationDto }
      )
      .get(
        "/",
        async ({ user, query, augmentationService }) => {
          return augmentationService.getAugmentationsByUserId(user.id, query);
        },
        { query: paginationDto, response: augmentationsResponseDto }
      )
      .get("/:id", async ({ user, params, augmentationService }) => {
        return augmentationService.getAugmentationById(user.id, params.id);
      })
      .put(
        "/:id",
        async ({ user, params, body, augmentationService }) => {
          return augmentationService.updateAugmentation(
            user.id,
            params.id,
            body
          );
        },
        { body: updateAugmentationDto }
      )
      .delete("/:id", async ({ user, params, augmentationService }) => {
        return augmentationService.deleteAugmentation(user.id, params.id);
      })
  );
