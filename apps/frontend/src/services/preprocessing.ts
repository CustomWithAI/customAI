import { axiosClient } from "@/libs/api-client";
import type { PreprocessingModel } from "@/types/response/preprocessing";

export const preprocessingService = {
	createPreprocessing: async ({
		data,
		name,
	}: { data: Record<string, any>; name: string }) => {
		try {
			return axiosClient.post<PreprocessingModel>("/image-preprocessings/", {
				name,
				data,
			});
		} catch (error) {}
	},
	updatePreprocessing: async ({
		data,
		name,
		id,
	}: { data?: Record<string, any>; name?: string; id: string }) => {
		try {
			return axiosClient.put<PreprocessingModel>(
				`/image-preprocessings/${id}`,
				{
					name,
					data,
				},
			);
		} catch (error) {}
	},
};
