import sharp from "sharp";
import type { ImageRepository } from "@/applications/repositories/imageRepository";
import type { DatasetRepository } from "@/applications/repositories/datasetRepository";
import type { images } from "@/domains/schema/images";
import type { PaginationParams } from "@/utils/db-type";
import {
  uploadFile,
  deleteFile,
  generatePresignedUrl,
} from "@/infrastructures/s3/s3";
import { v7 } from "uuid";
import { InternalServerError, NotFoundError } from "elysia";

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

  private async convertToPng(file: File): Promise<Buffer> {
    const buffer = await file.arrayBuffer();
    return sharp(Buffer.from(buffer)).png().toBuffer();
  }

  public async uploadImages(userId: string, datasetId: string, files: File[]) {
    await this.ensureDatasetExists(userId, datasetId);

    const imageRecords = [];

    for (const file of files) {
      const filePath = `datasets/${datasetId}/${v7()}.png`;
      const buffer = await this.convertToPng(file);

      await uploadFile(filePath, buffer, "image/png");

      imageRecords.push({ path: filePath, datasetId, annotation: {} });
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
    pagination: PaginationParams
  ) {
    await this.ensureDatasetExists(userId, datasetId);

    const result = await this.repository.findByDatasetId(datasetId, pagination);

    return {
      ...result,
      data: result.data.map((image) => ({
        ...image,
        path: encodeURIComponent(image.path),
        url: generatePresignedUrl(image.path),
      })),
    };
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
      updatedFilePath = `datasets/${datasetId}/${v7()}.png`;
      const buffer = await this.convertToPng(file);
      await uploadFile(updatedFilePath, buffer, "image/png");
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
