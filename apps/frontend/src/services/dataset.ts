import { axiosClient } from "@/libs/api-client";
import type {
	ResponseDataset,
	ResponseImage,
	ResponseSurroundImage,
} from "@/types/response/dataset";
import type { DatasetDetailsSchema } from "../models/dataset";
import type { ResponsePagination } from "../types/common";

export const datasetService = {
	createDataset: async ({ data }: { data: DatasetDetailsSchema }) => {
		try {
			return axiosClient.post<ResponseDataset>("/datasets", data);
		} catch (error) {}
	},

	updateDataset: async ({
		id,
		data,
	}: {
		id: string;
		data: Partial<
			Omit<ResponseDataset, "userId, imageCount, images, createdAt, updatedAt">
		>;
	}) => {
		try {
			const { data: responseData } = await axiosClient.put<ResponseDataset>(
				`/datasets/${id}`,
				data,
			);
			return responseData;
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

	getDatasets: async (
		{ pageParam }: { pageParam: string | null } = { pageParam: null },
	): Promise<ResponsePagination<ResponseDataset>> => {
		const response = await axiosClient.get<ResponsePagination<ResponseDataset>>(
			`/datasets/${pageParam || ""}`,
		);
		return response.data;
	},

	deleteDataset: async ({ id }: { id: string }) => {
		try {
			return axiosClient.delete(`/dataset/${id}`);
		} catch (error) {}
	},

	getImages: async ({ id, params }: { id: string; params?: string }) => {
		try {
			const { data } = await axiosClient.get<ResponsePagination<ResponseImage>>(
				`/datasets/${id}/images${params || ""}`,
			);
			return data;
		} catch (error) {}
	},

	updateImage: async ({
		data,
		id,
		imagesPath,
	}: { data: Partial<ResponseImage>; id: string; imagesPath: string }) => {
		try {
			const response = await axiosClient.put<ResponseImage>(
				`/datasets/${id}/images/${imagesPath}/`,
				data,
			);
			return response?.data;
		} catch (error) {}
	},

	getSurroundImageById: async ({
		id,
		pathId,
	}: { id: string; pathId: string }) => {
		try {
			const { data } = await axiosClient.get<ResponseSurroundImage>(
				`/datasets/${id}/images/surrounding/${pathId}`,
			);
			return data;
		} catch (error) {}
	},

	deleteImage: async ({ id, path }: { id: string; path: string }) => {
		try {
			return axiosClient.delete(`/datasets/${id}/images/${path}`);
		} catch (error) {}
	},
};
