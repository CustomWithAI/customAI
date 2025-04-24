import { axiosClient } from "@/libs/api-client";
import type { ResponsePagination } from "@/types/common";
import type { ResponseCustomModel } from "@/types/response/customModel";

export const customModelService = {
	createCustomModel: async ({
		data,
		name,
		type,
	}: {
		name?: string;
		type?: string;
		data: unknown[];
	}) => {
		try {
			return axiosClient.post<ResponseCustomModel>("custom-models", {
				data,
				name,
				type,
			});
		} catch (error) {}
	},
	getCustomModel: async (
		{ pageParam }: { pageParam: string | null } = { pageParam: null },
	) => {
		try {
			const response = await axiosClient.get<
				ResponsePagination<ResponseCustomModel>
			>(`/custom-models${pageParam || ""}`);
			return response?.data;
		} catch (error) {}
	},
	updateCustomModel: async ({
		id,
		name,
		type,
		data,
	}: {
		id: string;
		name?: string;
		type?: string;
		data?: unknown[];
	}) => {
		try {
			return axiosClient.put<ResponseCustomModel>(`/custom-models/${id}`, {
				data,
				name,
				type,
			});
		} catch (error) {}
	},
};
