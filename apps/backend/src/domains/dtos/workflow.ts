import { t } from "elysia";

export const createWorkflowDto = t.Object({
  name: t.String({ maxLength: 255 }),
  description: t.String({ maxLength: 255 }),
  type: t.String({ maxLength: 255 }),
});

export const updateWorkflowDto = t.Partial(createWorkflowDto);

export type CreateWorkflowDto = typeof createWorkflowDto.static;
export type UpdateWorkflowDto = typeof updateWorkflowDto.static;
