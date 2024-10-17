import { z } from "zod";
import packageJson from "../../package.json";

const envSchema = z.object({
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string(),
	BETTER_AUTH_TRUSTED_ORIGINS: z.string(),
	APP_VERSION: z.string().default(packageJson.version),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	APP_PORT: z.coerce.number().default(3000),
	ENABLE_SWAGGER: z
		.string()
		.refine((s) => s === "true" || s === "false")
		.transform((s) => s === "true"),
});

export const config = envSchema.parse(process.env);
