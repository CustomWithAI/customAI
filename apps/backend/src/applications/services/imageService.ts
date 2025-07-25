import type { DatasetRepository } from "@/applications/repositories/datasetRepository";
import type { ImageRepository } from "@/applications/repositories/imageRepository";
import type { images } from "@/domains/schema/images";
import {
  deleteFile,
  generatePresignedUrl,
  uploadFile,
} from "@/infrastructures/s3/s3";
import type { PaginationParams } from "@/utils/db-type";
import { convertToJpg } from "@/utils/file";
import { InternalServerError, NotFoundError } from "elysia";
import { v7 } from "uuid";

export class ImageService {
  public constructor(
    private repository: ImageRepository,
    private datasetRepository: DatasetRepository
  ) {}

  private async ensureDatasetExists(userId: string, datasetId: string) {
    const dataset = await this.datasetRepository.findById(userId, datasetId);
    if (!dataset.length) {
      throw new NotFoundError(`Dataset not found: ${datasetId}`);
    }
  }

  public async uploadImages(userId: string, datasetId: string, files: File[]) {
    await this.ensureDatasetExists(userId, datasetId);

    const imageRecords = [];

    for (const file of files) {
      const filePath = `datasets/${datasetId}/${v7()}.jpg`;
      const buffer = await convertToJpg(file);

      await uploadFile(filePath, buffer, "image/jpg");

      imageRecords.push({ path: filePath, datasetId });
    }

    const result = await this.repository.create(imageRecords);
    return result.map((image) => ({
      ...image,
      path: encodeURIComponent(image.path),
      url: generatePresignedUrl(image.path),
    }));
  }

  public async getImagesByDatasetId(
    userId: string,
    datasetId: string,
    pagination: PaginationParams,
    useBy: "client" | "server" = "client"
  ) {
    await this.ensureDatasetExists(userId, datasetId);

    const result = await this.repository.findByDatasetId(datasetId, pagination);

    return {
      ...result,
      data: result.data.map((image) => ({
        ...image,
        path: encodeURIComponent(image.path),
        url: generatePresignedUrl(image.path, useBy),
      })),
    };
  }

  public async getSurroundingImages(
    userId: string,
    datasetId: string,
    filePath: string
  ) {
    await this.ensureDatasetExists(userId, datasetId);

    const result = await this.repository.findSurroundingByPath(
      datasetId,
      filePath
    );
    if (!result || result?.current === null) {
      throw new NotFoundError(`Image not found: ${filePath}`);
    }

    return Object.fromEntries(
      Object.entries(result).map(([key, value]) => [
        key,
        value
          ? {
              ...value,
              path: encodeURIComponent(value.path),
              url: generatePresignedUrl(value.path),
            }
          : null,
      ])
    );
  }

  public async getImageByPath(
    userId: string,
    datasetId: string,
    filePath: string
  ) {
    await this.ensureDatasetExists(userId, datasetId);

    const result = await this.repository.findByPath(datasetId, filePath);
    if (result.length === 0) {
      throw new NotFoundError(`Image not found: ${filePath}`);
    }

    return {
      ...result[0],
      path: encodeURIComponent(result[0].path),
      url: generatePresignedUrl(result[0].path),
    };
  }

  public async updateImage(
    userId: string,
    datasetId: string,
    filePath: string,
    data: Partial<typeof images.$inferInsert>,
    file?: File
  ) {
    await this.ensureDatasetExists(userId, datasetId);

    const existingImage = await this.repository.findByPath(datasetId, filePath);
    if (existingImage.length === 0) {
      throw new NotFoundError(`Image not found: ${filePath}`);
    }

    let updatedFilePath = filePath;
    if (file) {
      await deleteFile(filePath);
      updatedFilePath = `datasets/${datasetId}/${v7()}.jpg`;
      const buffer = await convertToJpg(file);
      await uploadFile(updatedFilePath, buffer, "image/jpg");
      data.path = updatedFilePath;
    }

    const result = await this.repository.updateByPath(
      datasetId,
      filePath,
      data
    );
    if (result.length === 0) {
      throw new InternalServerError("Failed to update image");
    }

    return {
      ...result[0],
      url: generatePresignedUrl(result[0].path || updatedFilePath),
    };
  }

  public async deleteImage(
    userId: string,
    datasetId: string,
    filePath: string
  ) {
    await this.ensureDatasetExists(userId, datasetId);

    const existingImage = await this.repository.findByPath(datasetId, filePath);
    if (existingImage.length === 0) {
      throw new NotFoundError(`Image not found: ${filePath}`);
    }

    await deleteFile(filePath);
    const result = await this.repository.deleteByPath(datasetId, filePath);
    if (result.length === 0) {
      throw new InternalServerError("Failed to delete image");
    }

    return { message: "Image deleted successfully" };
  }
}
