import { Elysia } from "elysia";
import { imagePreprocessingService } from "@/config/dependencies";
import {
  imagePreprocessingResponseDto,
  imagePreprocessingsResponseDto,
  createImagePreprocessingDto,
  updateImagePreprocessingDto,
} from "@/domains/dtos/imagePreprocessing";
import { userMiddleware } from "@/middleware/authMiddleware";
import { paginationDto } from "@/domains/dtos/pagination";

export const imagePreprocessing = new Elysia({
  name: "image-preprocessing-controller",
  prefix: "image-preprocessings",
  detail: {
    tags: ["Image Preprocessing"],
  },
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("imagePreprocessingService", imagePreprocessingService)
  .guard({ response: imagePreprocessingResponseDto }, (app) =>
    app
      .post(
        "/",
        async ({ user, body, imagePreprocessingService }) => {
          return imagePreprocessingService.createImagePreprocessing({
            ...body,
            userId: user.id,
          });
        },
        { body: createImagePreprocessingDto }
      )
      .get(
        "/",
        async ({ user, query, imagePreprocessingService }) => {
          return imagePreprocessingService.getImagePreprocessingsByUserId(
            user.id,
            query
          );
        },
        { query: paginationDto, response: imagePreprocessingsResponseDto }
      )
      .get("/:id", async ({ user, params, imagePreprocessingService }) => {
        return imagePreprocessingService.getImagePreprocessingById(
          user.id,
          params.id
        );
      })
      .put(
        "/:id",
        async ({ user, params, body, imagePreprocessingService }) => {
          return imagePreprocessingService.updateImagePreprocessing(
            user.id,
            params.id,
            body
          );
        },
        { body: updateImagePreprocessingDto }
      )
      .delete("/:id", async ({ user, params, imagePreprocessingService }) => {
        return imagePreprocessingService.deleteImagePreprocessing(
          user.id,
          params.id
        );
      })
  );
