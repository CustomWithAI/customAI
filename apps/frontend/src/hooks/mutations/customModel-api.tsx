import { customModelService } from "@/services/customModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCustomModel = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: customModelService.createCustomModel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["customModel"] });
		},
	});
};
