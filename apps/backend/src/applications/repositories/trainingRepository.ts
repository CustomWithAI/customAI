import { trainings } from "@/domains/schema/trainings";
import { datasets } from "@/domains/schema/datasets";
import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { featureExtractions } from "@/domains/schema/featureExtractions";
import { featureSelections } from "@/domains/schema/featureSelections";
import { augmentations } from "@/domains/schema/augmentations";
import { customModels } from "@/domains/schema/customModels";
import type { TrainingStatusEnum } from "@/domains/schema/trainings";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { and, eq, getTableColumns } from "drizzle-orm";
import type { TrainingResponseDto } from "@/domains/dtos/training";
import { workflows } from "@/domains/schema/workflows";

export class TrainingRepository {
  public async create(data: typeof trainings.$inferInsert) {
    return db.insert(trainings).values(data).returning();
  }

  public async findByWorkflowId(
    workflowId: string,
    pagination: PaginationParams
  ) {
    const total = await db.$count(
      trainings,
      eq(trainings.workflowId, workflowId)
    );

    if (total === 0) return { data: [], total };

    const {
      workflowId: resultWorkflowId,
      datasetId,
      imagePreprocessingId,
      featureExtractionId,
      featureSelectionId,
      augmentationId,
      customModelId,
      ...rest
    } = getTableColumns(trainings);

    const query = db
      .select({
        ...rest,
        dataset: datasets,
        imagePreprocessing: imagePreprocessings,
        featureExtraction: featureExtractions,
        featureSelection: featureSelections,
        augmentation: augmentations,
        customModel: customModels,
      })
      .from(trainings)
      .leftJoin(datasets, eq(trainings.datasetId, datasets.id))
      .leftJoin(
        imagePreprocessings,
        eq(trainings.imagePreprocessingId, imagePreprocessings.id)
      )
      .leftJoin(
        featureExtractions,
        eq(trainings.featureExtractionId, featureExtractions.id)
      )
      .leftJoin(
        featureSelections,
        eq(trainings.featureSelectionId, featureSelections.id)
      )
      .leftJoin(augmentations, eq(trainings.augmentationId, augmentations.id))
      .leftJoin(customModels, eq(trainings.customModelId, customModels.id))
      .$dynamic();

    const paginatedData = await withPagination<
      typeof query,
      typeof trainings,
      TrainingResponseDto
    >(query, {
      mode: "cursor",
      where: eq(trainings.workflowId, workflowId),
      options: {
        table: trainings,
        primaryKey: "id",
        cursorFields: [],
        cursor: pagination.cursor,
        limit: pagination.limit,
      },
    });

    return {
      total,
      ...paginatedData,
    };
  }

  public async findById(workflowId: string, id: string) {
    const {
      workflowId: resultWorkflowId,
      datasetId,
      imagePreprocessingId,
      featureExtractionId,
      featureSelectionId,
      augmentationId,
      customModelId,
      ...rest
    } = getTableColumns(trainings);

    return db
      .select({
        ...rest,
        dataset: datasets,
        imagePreprocessing: imagePreprocessings,
        featureExtraction: featureExtractions,
        featureSelection: featureSelections,
        augmentation: augmentations,
        customModel: customModels,
        workflow: workflows,
      })
      .from(trainings)
      .leftJoin(datasets, eq(trainings.datasetId, datasets.id))
      .leftJoin(
        imagePreprocessings,
        eq(trainings.imagePreprocessingId, imagePreprocessings.id)
      )
      .leftJoin(
        featureExtractions,
        eq(trainings.featureExtractionId, featureExtractions.id)
      )
      .leftJoin(
        featureSelections,
        eq(trainings.featureSelectionId, featureSelections.id)
      )
      .leftJoin(augmentations, eq(trainings.augmentationId, augmentations.id))
      .leftJoin(customModels, eq(trainings.customModelId, customModels.id))
      .innerJoin(workflows, eq(trainings.workflowId, workflows.id))
      .where(and(eq(trainings.id, id), eq(trainings.workflowId, workflowId)))
      .limit(1);
  }

  public async updateById(
    workflowId: string,
    id: string,
    data: Partial<typeof trainings.$inferInsert>
  ) {
    return db
      .update(trainings)
      .set(data)
      .where(and(eq(trainings.id, id), eq(trainings.workflowId, workflowId)))
      .returning();
  }

  public async updateByWorkflowId(
    workflowId: string,
    data: Partial<typeof trainings.$inferInsert>
  ) {
    return db
      .update(trainings)
      .set(data)
      .where(and(eq(trainings.workflowId, workflowId)))
      .returning();
  }

  public async deleteById(workflowId: string, id: string) {
    return db
      .delete(trainings)
      .where(and(eq(trainings.id, id), eq(trainings.workflowId, workflowId)))
      .returning();
  }

  public async updateStatus(
    id: string,
    status: TrainingStatusEnum,
    queueId?: string
  ) {
    return db
      .update(trainings)
      .set(queueId ? { status, queueId } : { status })
      .where(eq(trainings.id, id))
      .returning();
  }
}
