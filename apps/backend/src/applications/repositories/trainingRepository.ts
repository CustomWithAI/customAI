import type { TrainingResponseDto } from "@/domains/dtos/training";
import { augmentations } from "@/domains/schema/augmentations";
import { customModels } from "@/domains/schema/customModels";
import { datasets } from "@/domains/schema/datasets";
import { featureExtractions } from "@/domains/schema/featureExtractions";
import { featureSelections } from "@/domains/schema/featureSelections";
import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { trainings } from "@/domains/schema/trainings";
import type { TrainingStatusEnum } from "@/domains/schema/trainings";
import { workflows } from "@/domains/schema/workflows";
import { db } from "@/infrastructures/database/connection";
import type { PaginationParams } from "@/utils/db-type";
import withPagination from "@/utils/pagination";
import { queryParser } from "@/utils/query-parser";
import { and, desc, eq, getTableColumns } from "drizzle-orm";

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
        filters: queryParser(pagination.filter),
        orderBy: queryParser(pagination.orderBy),
        search: queryParser(pagination.search),
        cursor: pagination.cursor,
        limit: pagination.limit,
      },
    });

    return {
      total,
      ...paginatedData,
    };
  }

  public async findLatestByWorkflowId(workflowId: string) {
    return db
      .select({ version: trainings.version })
      .from(trainings)
      .where(eq(trainings.workflowId, workflowId))
      .orderBy(desc(trainings.createdAt))
      .limit(1);
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

  public async findByDefault(workflowId: string) {
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
      .where(
        and(eq(trainings.isDefault, true), eq(trainings.workflowId, workflowId))
      )
      .limit(1);
  }

  public async findModelInferenceInfoById(id: string) {
    const {
      workflowId,
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
        workflow: workflows,
      })
      .from(trainings)
      .leftJoin(datasets, eq(trainings.datasetId, datasets.id))
      .innerJoin(workflows, eq(trainings.workflowId, workflows.id))
      .where(eq(trainings.id, id))
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
