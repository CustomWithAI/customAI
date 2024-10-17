import { config } from "@/config/env";
import { db } from "@/infrastructures/database/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Context } from "elysia/context";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: config.GOOGLE_CLIENT_ID,
			clientSecret: config.GOOGLE_CLIENT_SECRET,
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["email-password", "google"],
		},
	},
	rateLimit: {
		storage: "database",
		tableName: "rateLimit",
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
			},
		},
	},
});

export const betterAuthView = (context: Context) => {
	const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
	if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
		return auth.handler(context.request);
	}
	context.error(405);
};

export type Session = typeof auth.$Infer.Session;
