import { Elysia } from "elysia";
import { augmentationService } from "@/config/dependencies";
import {
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
  .post(
    "/",
    async ({ user, body, augmentationService }) => {
      return augmentationService.createAugmentation({
        name: body.name,
        data: body.data,
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
    { query: paginationDto }
  )
  .get("/:id", async ({ params, augmentationService }) => {
    return augmentationService.getAugmentationById(params.id);
  })
  .put(
    "/:id",
    async ({ params, body, augmentationService }) => {
      return augmentationService.updateAugmentation(params.id, body);
    },
    { body: updateAugmentationDto }
  )
  .delete("/:id", async ({ params, augmentationService }) => {
    return augmentationService.deleteAugmentation(params.id);
  });
