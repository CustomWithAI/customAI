import { t } from "elysia";

export const createDatasetDto = t.Object({
	name: t.String({ maxLength: 255 }),
	description: t.String({ maxLength: 255 }),
	annotationMethod: t.String({ maxLength: 255 }),
	splitData: t.Record(t.String(), t.Any()),
});

export const updateDatasetDto = t.Partial(createDatasetDto);

export type CreateDatasetDto = typeof createDatasetDto.static;
export type UpdateDatasetDto = typeof updateDatasetDto.static;
