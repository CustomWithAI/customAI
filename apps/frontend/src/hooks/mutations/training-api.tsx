import authService from "@/services/auth";
import { trainingService } from "@/services/training";
import { workflowService } from "@/services/workflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateTraining = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: trainingService.createTraining,
		onSuccess: (ctx) => {
			queryClient.invalidateQueries({
				queryKey: ["trainings", ctx?.data.workflowId, ctx?.data.id],
			});
		},
	});
};

export const useUpdateTraining = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: trainingService.updateTraining,
		onSuccess: (ctx) => {
			queryClient.invalidateQueries({
				queryKey: ["training", ctx?.data.workflowId, ctx?.data.id],
			});
		},
	});
};

export const useStartTraining = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: trainingService.startTraining,
		onSuccess: (_, params) => {
			queryClient.invalidateQueries({
				queryKey: ["training", params.workflowId, params.trainingId],
			});
		},
	});
};
