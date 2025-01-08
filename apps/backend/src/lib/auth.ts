import { config } from "@/config/env";
import { db } from "@/infrastructures/database/connection";
import { redis } from "@/infrastructures/redis/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import type { Context } from "elysia/context";
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	basePath: "/api/auth",
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},
	socialProviders: {
		google: {
			clientId: config.GOOGLE_CLIENT_ID,
			clientSecret: config.GOOGLE_CLIENT_SECRET,
		},
	},
	secondaryStorage: {
		get: async (key) => await redis.get(key),
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, { EX: ttl });
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.del(key);
		},
	},
	plugins: [admin(), openAPI()],
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["email-password", "google"],
		},
	},
	rateLimit: {
		customRules: {
			"/sign-in/email": {
				window: 10,
				max: 7,
			},
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
		additionalFields: {},
	},
	user: {
		additionalFields: {},
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {},
				after: async (user) => {},
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

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
