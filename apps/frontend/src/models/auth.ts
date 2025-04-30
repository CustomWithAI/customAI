import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().email().min(1, {
		message: "email is required",
	}),
	password: z
		.string()
		.min(8, {
			message: "password must be at least 8 characters.",
		})
		.max(32),
});

export const SignUpSchema = z.object({
	name: z.string().min(1, {
		message: "name is required",
	}),
	email: z.string().email().min(1, {
		message: "email is required",
	}),
	password: z.string(),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export type LoginSchemaType = z.infer<typeof LoginSchema>;
