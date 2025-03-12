import { featureExService } from "@/services/feature-ex";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateFeatureEx = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: featureExService.createFeatureEx,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["featureEx", data?.data.id],
			});
		},
	});
};

export const useUpdateFeatureEx = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: featureExService.updateFeatureEx,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["featureEx", data?.data.id],
			});
		},
	});
};
