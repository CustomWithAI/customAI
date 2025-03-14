import { toMultipleResponse } from "@/utils/dto";
import { t } from "elysia";

export const createWorkflowDto = t.Object({
  name: t.String({ maxLength: 255 }),
  description: t.String({ maxLength: 255 }),
  type: t.String({ maxLength: 255 }),
});

export const updateWorkflowDto = t.Partial(createWorkflowDto);

export const workflowResponseDto = t.Object({
  ...createWorkflowDto.properties,
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  userId: t.String(),
});

export const workflowsResponseDto = toMultipleResponse(workflowResponseDto);

export type CreateWorkflowDto = typeof createWorkflowDto.static;
export type UpdateWorkflowDto = typeof updateWorkflowDto.static;
export type WorkflowResponseDto = typeof workflowResponseDto.static;
export type WorkflowsResponseDto = typeof workflowsResponseDto.static;
