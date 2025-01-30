import { authClient } from "@/libs/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useSocialAccounts = () =>
	useQuery({
		queryKey: ["social-account"],
		queryFn: async () => {
			return authClient.listAccounts();
		},
	});

export const useActivitySessions = () =>
	useQuery({
		queryKey: ["sessions-activity"],
		queryFn: async () => {
			return authClient.listSessions();
		},
	});

export const useRetrieveSession = () =>
	useQuery({
		queryKey: ["retrieve-session"],
		queryFn: async () => {
			return authClient.getSession();
		},
	});
