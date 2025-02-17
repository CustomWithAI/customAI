import { t } from "elysia";

export const createCustomModelDto = t.Object({
  name: t.String({ maxLength: 255 }),
  data: t.Record(t.String(), t.Any()),
});

export const updateCustomModelDto = t.Partial(createCustomModelDto);

export type CreateCustomModelDto = typeof createCustomModelDto.static;
export type UpdateCustomModelDto = typeof updateCustomModelDto.static;
