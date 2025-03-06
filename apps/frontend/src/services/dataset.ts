import { axiosClient } from "@/libs/api-client";
import type { ResponseDataset, ResponseImage } from "@/types/response/dataset";
import type { responsePagination } from "../types/common";

export const datasetService = {
	createDataset: async () => {
		try {
			axiosClient.post("/dataset");
		} catch (error) {}
	},

	updateDataset: async () => {
		try {
			axiosClient.patch("/dataset");
		} catch (error) {}
	},

	getDataset: async ({ id }: { id: string }) => {
		try {
			const { data } = await axiosClient.get<ResponseDataset>(
				`/datasets/${id}`,
			);
			return data;
		} catch (error) {}
	},

	getDatasets: async () => {
		try {
			const { data } =
				await axiosClient.get<responsePagination<ResponseDataset>>(
					"/datasets/",
				);
			return data;
		} catch (error) {}
	},

	deleteDataset: () => {
		try {
			axiosClient.delete("/dataset");
		} catch (error) {}
	},

	getImages: async ({ id, params }: { id: string; params?: string }) => {
		try {
			const { data } = await axiosClient.get<responsePagination<ResponseImage>>(
				`/datasets/${id}/images${params || ""}`,
			);
			return data;
		} catch (error) {}
	},
};
