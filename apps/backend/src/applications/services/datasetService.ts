import type { DatasetRepository } from "@/applications/repositories/datasetRepository";
import type {
  ClassificationAnnotationDto,
  ObjectDetectionAnnotationDto,
  SegmentationAnnotationDto,
} from "@/domains/dtos/image";
import type { datasets } from "@/domains/schema/datasets";
import { deleteFile, generatePresignedUrl } from "@/infrastructures/s3/s3";
import type { PaginationParams } from "@/utils/db-type";
import { getPolygonArea } from "@/utils/polygonArea";
import { InternalServerError, NotFoundError, error } from "elysia";

export class DatasetService {
  public constructor(private repository: DatasetRepository) {}

  public async createDataset(data: typeof datasets.$inferInsert) {
    const result = await this.repository.create(data);
    if (result.length === 0) {
      throw new InternalServerError("Failed to create dataset");
    }
    return result[0];
  }

  public async getDatasetsByUserId(
    userId: string,
    pagination: PaginationParams
  ) {
    const result = await this.repository.findByUserId(userId, pagination);
    return {
      ...result,
      data: result.data.map((data) => ({
        ...data,
        images: data.images?.map((image: string) =>
          generatePresignedUrl(image)
        ),
      })),
    };
  }

  public async annotationStatus(userId: string, id: string) {
    const labelCounts: Record<string, number> = {};
    const labelSizes: Record<
      string,
      {
        count: number;
        totalWidth: number;
        totalHeight: number;
        totalArea: number;
        avgWidth: number;
        avgHeight: number;
        avgArea: number;
      }
    > = {};
    const objectDetectionBoxSize: Record<string, number> = {};

    const imageList = await this.repository.getImagesByDataset(id);

    const dataset = await this.repository.findById(userId, id);

    if (dataset.length === 0) {
      throw error(404, "dataset not found");
    }

    switch (dataset[0].annotationMethod) {
      case "classification": {
        for (const image of imageList) {
          const classification =
            image.annotation as ClassificationAnnotationDto;
          labelCounts[String(classification.label)] =
            (labelCounts[String(classification.label)] || 0) + 1;
        }
        break;
      }
      case "object_detection": {
        for (const image of imageList) {
          const objectDetection =
            image.annotation as ObjectDetectionAnnotationDto;
          for (const imgAnnotation of objectDetection.annotation) {
            const label = imgAnnotation.label;
            labelCounts[label] = (labelCounts[label] || 0) + 1;

            if (!labelSizes[label]) {
              labelSizes[label] = {
                count: 0,
                totalWidth: 0,
                totalArea: 0,
                totalHeight: 0,
                avgWidth: 0,
                avgHeight: 0,
                avgArea: 0,
              };
            }

            if (imgAnnotation.width < 20 || imgAnnotation.height < 20) {
              objectDetectionBoxSize.small =
                (objectDetectionBoxSize.small || 0) + 1;
            }

            if (imgAnnotation.width > 500 || imgAnnotation.height > 500) {
              objectDetectionBoxSize.large =
                (objectDetectionBoxSize.large || 0) + 1;
            }

            const aspectRatio = imgAnnotation.width / imgAnnotation.height;
            if (aspectRatio < 0.1 || aspectRatio > 10) {
              objectDetectionBoxSize.suspicious =
                (objectDetectionBoxSize.suspicious || 0) + 1;
            }

            labelSizes[label].count++;
            labelSizes[label].totalWidth += imgAnnotation.width;
            labelSizes[label].totalHeight += imgAnnotation.height;
            labelSizes[label].totalArea +=
              imgAnnotation.width * imgAnnotation.height;
          }
        }
        break;
      }
      case "segmentation": {
        for (const image of imageList) {
          const segmentation = image.annotation as SegmentationAnnotationDto;
          for (const imgAnnotation of segmentation.annotation) {
            const label = imgAnnotation.label;
            labelCounts[label] = (labelCounts[label] || 0) + 1;
            const area = getPolygonArea(imgAnnotation.points);

            labelCounts[label] = (labelCounts[label] || 0) + 1;

            if (!labelSizes[label]) {
              labelSizes[label] = {
                count: 0,
                totalWidth: 0,
                totalArea: 0,
                totalHeight: 0,
                avgWidth: 0,
                avgHeight: 0,
                avgArea: 0,
              };
            }

            labelSizes[label].count++;
            labelSizes[label].totalArea += area;
          }
        }
        break;
      }
      default:
        throw error(422, "Unimplemented function");
    }
    for (const label of Object.keys(labelSizes)) {
      const size = labelSizes[label];
      size.avgWidth = size.totalWidth / size.count;
      size.avgHeight = size.totalHeight / size.count;
      size.avgArea = size.totalArea / size.count;
    }

    return {
      size: labelSizes,
      count: labelCounts,
      type: objectDetectionBoxSize,
    };
  }

  public async getDatasetById(userId: string, id: string) {
    const result = await this.repository.findById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Dataset not found: ${id}`);
    }
    return result[0];
  }

  public async updateDataset(
    userId: string,
    id: string,
    data: Partial<typeof datasets.$inferInsert>
  ) {
    const result = await this.repository.updateById(userId, id, data);
    if (result.length === 0) {
      throw new NotFoundError(`Dataset not found: ${id}`);
    }
    return result[0];
  }

  public async deleteDataset(userId: string, id: string) {
    const images = await this.repository.getImagesByDataset(id);
    await Promise.all(images.map((image) => deleteFile(image.path)));
    const result = await this.repository.deleteById(userId, id);
    if (result.length === 0) {
      throw new NotFoundError(`Dataset not found: ${id}`);
    }
    return result[0];
  }
}
