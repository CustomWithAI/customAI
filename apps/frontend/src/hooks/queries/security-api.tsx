import { authClient } from "@/libs/auth-client";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useQuery } from "@tanstack/react-query";

export const useSocialAccounts = () =>
	useQuery({
		queryKey: ["social-account"],
		queryFn: async () => {
			return authClient.listAccounts();
		},
	});
