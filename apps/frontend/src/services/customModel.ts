import { axiosClient } from "@/libs/api-client";
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
