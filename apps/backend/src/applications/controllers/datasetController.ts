import { datasetService, imageService } from "@/config/dependencies";
import {
	createDatasetDto,
	datasetResponseDto,
	datasetsResponseDto,
	updateDatasetDto,
} from "@/domains/dtos/dataset";
import {
	createImagesDto,
	deleteImageResponseDto,
	imageResponseDto,
	imagesResponseDto,
	updateImageDto,
} from "@/domains/dtos/image";
import { paginationDto } from "@/domains/dtos/pagination";
import { userMiddleware } from "@/middleware/authMiddleware";
import { Elysia } from "elysia";

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
	.guard({ response: datasetResponseDto }, (app) =>
		app
			.post(
				"/",
				async ({ user, body, datasetService }) => {
					return datasetService.createDataset({
						...body,
						userId: user.id,
					});
				},
				{ body: createDatasetDto },
			)
			.get(
				"/",
				async ({ user, query, datasetService }) => {
					return datasetService.getDatasetsByUserId(user.id, query);
				},
				{ query: paginationDto, response: datasetsResponseDto },
			)
			.get("/:id", async ({ user, params, datasetService }) => {
				return datasetService.getDatasetById(user.id, params.id);
			})
			.put(
				"/:id",
				async ({ user, params, body, datasetService }) => {
					return datasetService.updateDataset(user.id, params.id, body);
				},
				{ body: updateDatasetDto },
			)
			.delete("/:id", async ({ user, params, datasetService }) => {
				return datasetService.deleteDataset(user.id, params.id);
			}),
	)
	.group("/:id/images", (app) =>
		app
			.post(
				"/",
				async ({ user, params, body, imageService }) => {
					return imageService.uploadImages(user.id, params.id, body.files);
				},
				{ body: createImagesDto, response: imagesResponseDto.properties.data },
			)
			.get(
				"/",
				async ({ user, params, query, imageService }) => {
					return imageService.getImagesByDatasetId(user.id, params.id, query);
				},
				{ query: paginationDto, response: imagesResponseDto },
			)
			.get("/surrounding/:path", async ({ user, params, imageService }) => {
				return imageService.getSurroundingImages(
					user.id,
					params.id,
					decodeURIComponent(params.path),
				);
			})
			.get(
				"/:path",
				async ({ user, params, imageService }) => {
					return imageService.getImageByPath(
						user.id,
						params.id,
						decodeURIComponent(params.path),
					);
				},
				{ response: imageResponseDto },
			)
			.put(
				"/:path",
				async ({ user, params, body, imageService }) => {
					return imageService.updateImage(
						user.id,
						params.id,
						decodeURIComponent(params.path),
						body,
						body.file,
					);
				},
				{ body: updateImageDto, response: imageResponseDto },
			)
			.delete(
				"/:path",
				async ({ user, params, imageService }) => {
					return imageService.deleteImage(
						user.id,
						params.id,
						decodeURIComponent(params.path),
					);
				},
				{ response: deleteImageResponseDto },
			),
	);
