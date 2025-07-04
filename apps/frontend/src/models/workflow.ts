import { z } from "zod";

export type WorkflowDetails = z.infer<typeof workflowDetails>;

export const workflowDetails = z.object({
	name: z.string().min(1, { message: "name is required" }),
	description: z.string().optional(),
	type: z.string().min(1, { message: "type is required" }),
});
