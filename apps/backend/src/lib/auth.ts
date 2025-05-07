import { config } from "@/config/env";
import { account, session, user, verification } from "@/domains/schema/auth";
import { db } from "@/infrastructures/database/connection";
import { redis } from "@/infrastructures/redis/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: user,
			account: account,
			session: session,
			verification: verification,
		},
	}),
	trustedOrigins: [...config.BETTER_AUTH_TRUSTED_ORIGINS.split(",")],
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
		storage: "secondary-storage",
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
		additionalFields: {
			lang: {
				type: "string",
				required: false,
				defaultValue: "en",
			},
			experience: {
				type: "string",
				required: false,
			},
		},
	},
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
