import { axiosClient, axiosMediaClient } from "@/libs/api-client";
import { useUploadStore } from "@/stores/uploadStore";
import type { RequestUploadFileData } from "@/types/request/requestUploadFile";
import type { ResponseError } from "@/types/response/common";
import type { ResponseUploadFile } from "@/types/response/responseUploadFile";

import type { AxiosResponse } from "axios";
import axios from "axios";

class UploadService {
	async uploadFile(data: RequestUploadFileData) {
		const { file, datasetId } = data;
		const id = `${file.name}-${Date.now().toString()}`;
		const abortController = new AbortController();
		const uploadStore = useUploadStore.getState();
		uploadStore.addUpload({ id, filename: file.name, file, abortController });
		const formData = new FormData();
		formData.append("files", file);
		try {
			const response = await axiosMediaClient.post<
				ResponseError,
				AxiosResponse<ResponseUploadFile>,
				FormData
			>(`/datasets/${datasetId}/images`, formData, {
				signal: abortController.signal,
				onUploadProgress: (event) => {
					const progress = Math.round(
						(event.loaded / (event.total || 1)) * 100,
					);
					uploadStore.updateProgress(id, progress);
				},
			});
			uploadStore.completeUpload(id);
			return response.data;
		} catch (error) {
			uploadStore.updateError(id);
			if (axios.isCancel(error)) {
				console.log(`Upload canceled for file: ${file.name}`);
			} else {
				console.error("Upload failed", error);
			}
		}
	}

	async getFile(id: string) {
		const response = await axiosClient.get<ResponseUploadFile>(`files/${id}`);
		return response.data;
	}
}

const uploadService = new UploadService();
export default uploadService;
