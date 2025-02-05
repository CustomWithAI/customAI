import type { ImageRepository } from "@/applications/repositories/imageRepository";
import { HttpError } from "@/config/error";
import type { images } from "@/domains/schema/images";
import type { PaginationParams } from "@/utils/db-type";
import {
  uploadFile,
  deleteFile,
  generatePresignedUrl,
} from "@/infrastructures/s3/s3";

export class ImageService {
  public constructor(private repository: ImageRepository) {}

  public async uploadImages(datasetId: string, files: File[]) {
    if (!files || files.length === 0) {
      throw HttpError.BadRequest("No files provided");
    }

    const imageRecords = [];

    for (const file of files) {
      const filePath = `datasets/${datasetId}/${crypto.randomUUID()}-${
        file.name
      }`;
      const buffer = await file.arrayBuffer();

      await uploadFile(filePath, buffer, file.type);

      imageRecords.push({ url: filePath, datasetId });
    }

    return this.repository.create(imageRecords);
  }

  public async getImagesByDatasetId(
    datasetId: string,
    pagination: PaginationParams
  ) {
    const result = await this.repository.findByDatasetId(datasetId, pagination);
    const images = result.data;
    return images.map((image) => ({
      filePath: image.url,
      presignedUrl: generatePresignedUrl(image.url),
    }));
  }

  public async getImageByPath(datasetId: string, filePath: string) {
    const result = await this.repository.findByPath(datasetId, filePath);
    if (result.length === 0) {
      throw HttpError.NotFound(`Image not found: ${filePath}`);
    }

    return {
      filePath: result[0].url,
      presignedUrl: generatePresignedUrl(result[0].url),
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

    if (file) {
      await deleteFile(filePath);
      const newFilePath = `datasets/${datasetId}/${crypto.randomUUID()}-${
        file.name
      }`;
      const buffer = await file.arrayBuffer();
      await uploadFile(newFilePath, buffer, file.type);
      data.url = newFilePath;
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
      filePath: result[0].url,
      presignedUrl: generatePresignedUrl(result[0].url),
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
