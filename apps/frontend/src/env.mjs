import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_BACKEND_URL: z.string().url(),
		NEXT_PUBLIC_FRONTEND_URL: z.string().url().default("http://localhost:3000"),
	},
	server: {
		NEXT_SERVER_BACKEND_URL: z.string().url(),
	},
	experimental__runtimeEnv: {
		NEXT_SERVER_BACKEND_URL: process.env.NEXT_SERVER_BACKEND_URL,
		NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
	},
});
