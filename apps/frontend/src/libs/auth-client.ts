import {
	adminClient,
	inferAdditionalFields,
	magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	plugins: [
		magicLinkClient(),
		adminClient(),
		inferAdditionalFields({
			user: {
				lang: {
					type: "string",
					required: false,
				},
				experience: {
					type: "string",
					required: false,
				},
			},
		}),
	],
});

export const useSession = authClient.useSession;
