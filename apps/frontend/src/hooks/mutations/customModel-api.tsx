import { customModelService } from "@/services/customModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCustomModel = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: customModelService.createCustomModel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["customModel"] });
		},
	});
};

export const useUpdateCustomModel = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: customModelService.updateCustomModel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["customModel"] });
		},
	});
};
