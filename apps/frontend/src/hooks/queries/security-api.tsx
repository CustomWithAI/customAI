import { authClient } from "@/libs/auth-client";
import authService from "@/services/auth";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSocialAccounts = () =>
	useQuery({
		queryKey: ["social-account"],
		queryFn: async () => {
			return authClient.listAccounts();
		},
	});

export const useRevokeOtherSession = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: authService.revokeOtherSession,
		onSuccess: () => {
			queryClient.cancelQueries({ queryKey: ["sessions"] });
			queryClient.invalidateQueries({ queryKey: ["sessions"] });
		},
	});
};
