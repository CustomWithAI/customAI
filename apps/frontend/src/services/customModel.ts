import { axiosClient } from "@/libs/api-client";
import type { ResponseCustomModel } from "@/types/response/customModel";

export const customModelService = {
	createCustomModel: async ({
		data,
	}: { data: { name: string; type: string; data?: string } }) => {
		try {
			return axiosClient.post<ResponseCustomModel>("custom-models", data);
		} catch (error) {}
	},
};
