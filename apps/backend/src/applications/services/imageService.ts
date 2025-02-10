import type { ImageRepository } from "@/applications/repositories/imageRepository";
import { HttpError } from "@/config/error";
import type { images } from "@/domains/schema/images";
import type { PaginationParams } from "@/utils/db-type";
import {
  uploadFile,
  deleteFile,
  generatePresignedUrl,
} from "@/infrastructures/s3/s3";
import { v7 } from "uuid";

export class ImageService {
  public constructor(private repository: ImageRepository) {}

  public async uploadImages(datasetId: string, files: File[]) {
    if (!files || files.length === 0) {
      throw HttpError.BadRequest("No files provided");
    }

    const imageRecords = [];

    for (const file of files) {
      const filePath = `datasets/${datasetId}/${v7()}-${file.name}`;
      const buffer = await file.arrayBuffer();

      await uploadFile(filePath, buffer, file.type);

      imageRecords.push({ path: filePath, datasetId, annotation: {} });
    }

    const result = await this.repository.create(imageRecords);
    return result.map((image) => ({
      ...image,
      url: generatePresignedUrl(image.path),
    }));
  }

  public async getImagesByDatasetId(
    datasetId: string,
    pagination: PaginationParams
  ) {
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

  public async getImageByPath(datasetId: string, filePath: string) {
    const result = await this.repository.findByPath(datasetId, filePath);
    if (result.length === 0) {
      throw HttpError.NotFound(`Image not found: ${filePath}`);
    }

    return {
      ...result[0],
      path: encodeURIComponent(result[0].path),
      url: generatePresignedUrl(result[0].path),
    };
  }

  public async updateImage(
    datasetId: string,
    filePath: string,
    data: Partial<typeof images.$inferInsert>,
    file?: File
  ) {
    const existingImage = await this.repository.findByPath(datasetId, filePath);
    if (existingImage.length === 0) {
      throw HttpError.NotFound(`Image not found: ${filePath}`);
    }

    let updatedFilePath = filePath;
    if (file) {
      await deleteFile(filePath);
      updatedFilePath = `datasets/${datasetId}/${crypto.randomUUID()}-${
        file.name
      }`;
      const buffer = await file.arrayBuffer();
      await uploadFile(updatedFilePath, buffer, file.type);
      data.path = updatedFilePath;
    }

    const result = await this.repository.updateByPath(
      datasetId,
      filePath,
      data
    );
    if (result.length === 0) {
      throw HttpError.Internal("Failed to update image");
    }

    return {
      ...result[0],
      url: generatePresignedUrl(result[0].path || updatedFilePath),
    };
  }

  public async deleteImage(datasetId: string, filePath: string) {
    const existingImage = await this.repository.findByPath(datasetId, filePath);
    if (existingImage.length === 0) {
      throw HttpError.NotFound(`Image not found: ${filePath}`);
    }

    await deleteFile(filePath);
    const result = await this.repository.deleteByPath(datasetId, filePath);
    if (result.length === 0) {
      throw HttpError.Internal("Failed to delete image");
    }

    return { message: "Image deleted successfully" };
  }
}
