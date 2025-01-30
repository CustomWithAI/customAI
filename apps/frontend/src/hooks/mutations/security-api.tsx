import authService from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
