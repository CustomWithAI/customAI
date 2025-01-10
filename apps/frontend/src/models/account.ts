import { z } from "zod";

export const accountSchema = z.object({
	username: z.string().email().min(1, {
		message: "username is required",
	}),
});

export type AccountSchema = z.infer<typeof accountSchema>;
