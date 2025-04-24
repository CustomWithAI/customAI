import { axiosClient } from "@/libs/api-client";
import type { ResponsePagination } from "@/types/common";
import type { AugmentationModel } from "@/types/response/augmentation";

export const augmentationService = {
	createAugmentation: async ({
		data,
		name,
	}: { data: Record<string, unknown>; name: string }) => {
		try {
			return axiosClient.post<AugmentationModel>("/augmentations/", {
				name,
				data,
			});
		} catch (error) {}
	},
	getAugmentation: async (
		{ pageParam }: { pageParam: string | null } = { pageParam: null },
	) => {
		try {
			const response = await axiosClient.get<
				ResponsePagination<AugmentationModel>
			>(`/augmentations${pageParam || ""}`);
			return response?.data;
		} catch (error) {}
	},
	updateAugmentation: async ({
		id,
		name,
		data,
	}: { data?: Record<string, any>; name?: string; id: string }) => {
		try {
			return axiosClient.put<AugmentationModel>(`/augmentations/${id}`, {
				name,
				data,
			});
		} catch (error) {}
	},
};
