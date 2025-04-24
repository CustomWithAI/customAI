import { axiosClient } from "@/libs/api-client";
import type { ResponsePagination } from "@/types/common";
import type { FeatureExModel } from "@/types/response/feature-ex";

export const featureExService = {
	createFeatureEx: async ({
		data,
		name,
	}: { data: Record<string, any>; name: string }) => {
		try {
			return axiosClient.post<FeatureExModel>("/feature-extractions/", {
				name,
				data,
			});
		} catch (error) {}
	},
	getFeatureEx: async (
		{ pageParam }: { pageParam: string | null } = { pageParam: null },
	) => {
		try {
			const response = await axiosClient.get<
				ResponsePagination<FeatureExModel>
			>(`/feature-extractions${pageParam || ""}`);
			return response?.data;
		} catch (error) {}
	},
	updateFeatureEx: async ({
		data,
		id,
		name,
	}: { data?: Record<string, any>; name?: string; id?: string }) => {
		try {
			return axiosClient.put<FeatureExModel>(`/feature-extractions/${id}`, {
				name,
				data,
			});
		} catch (error) {}
	},
};
