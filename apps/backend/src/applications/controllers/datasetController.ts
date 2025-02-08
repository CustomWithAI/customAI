import { Elysia, t } from "elysia";
import { datasetService, imageService } from "@/config/dependencies";
import { userMiddleware } from "@/middleware/authMiddleware";
import { paginationDto } from "@/domains/dtos/pagination";
import { createDatasetDto, updateDatasetDto } from "@/domains/dtos/dataset";
import { createImagesDto, updateImageDto } from "@/domains/dtos/images";

export const dataset = new Elysia({
  name: "dataset-controller",
  prefix: "/datasets",
  detail: {
    tags: ["Dataset"],
  },
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("datasetService", datasetService)
  .decorate("imageService", imageService)
  .post(
    "/",
    async ({ user, body, datasetService }) => {
      return datasetService.createDataset({
        name: body.name,
        annotationMethod: body.annotationMethod,
        splitData: body.splitData,
        userId: user.id,
      });
    },
    { body: createDatasetDto }
  )
  .get(
    "/",
    async ({ user, query, datasetService }) => {
      return datasetService.getDatasetsByUserId(user.id, query);
    },
    { query: paginationDto }
  )
  .get("/:id", async ({ params, datasetService }) => {
    return datasetService.getDatasetById(params.id);
  })
  .put(
    "/:id",
    async ({ params, body, datasetService }) => {
      return datasetService.updateDataset(params.id, body);
    },
    { body: updateDatasetDto }
  )
  .delete("/:id", async ({ params, datasetService }) => {
    return datasetService.deleteDataset(params.id);
  })
  .group("/:id/images", (app) =>
    app
      .post(
        "/",
        async ({ params, body, imageService }) => {
          return imageService.uploadImages(params.id, body.files);
        },
        { body: createImagesDto }
      )
      .get(
        "/",
        async ({ params, query, imageService }) => {
          return imageService.getImagesByDatasetId(params.id, query);
        },
        { query: paginationDto }
      )
      .get("/:path", async ({ params, imageService }) => {
        return imageService.getImageByPath(
          params.id,
          decodeURIComponent(params.path)
        );
      })
      .put(
        "/:path",
        async ({ params, body, imageService }) => {
          return imageService.updateImage(
            params.id,
            decodeURIComponent(params.path),
            body,
            body.file
          );
        },
        { body: updateImageDto }
      )
      .delete("/:path", async ({ params, imageService }) => {
        return imageService.deleteImage(
          params.id,
          decodeURIComponent(params.path)
        );
      })
  );
