import { axiosClient, axiosMediaClient } from "@/libs/api-client";
import type { RequestUploadFileData } from "@/types/request/requestUploadFile";
import type { ResponseError } from "@/types/response/common";
import type { ResponseUploadFile } from "@/types/response/responseUploadFile";

import type { AxiosProgressEvent, AxiosResponse } from "axios";

class UploadService {
	async uploadFile(data: RequestUploadFileData) {
		const { file, progressCallbackFn, purpose } = data;
		const formData = new FormData();
		formData.append("purpose", purpose);
		formData.append("file", file);
		const response = await axiosMediaClient.post<
			ResponseError,
			AxiosResponse<ResponseUploadFile>,
			FormData
		>("/files", formData, {
			onUploadProgress: (progressEvent: AxiosProgressEvent) => {
				if (!progressCallbackFn) return;
				const progress =
					(progressEvent.loaded / (progressEvent?.total ?? 100)) * 50;
				progressCallbackFn(progress);
			},
			onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
				if (!progressCallbackFn) return;
				const progress =
					50 + (progressEvent.loaded / (progressEvent?.total ?? 100)) * 50;
				progressCallbackFn(progress);
			},
		});
		return response.data;
	}

	async getFile(id: string) {
		const response = await axiosClient.get<ResponseUploadFile>(`files/${id}`);
		return response.data;
	}
}

const uploadService = new UploadService();
export default uploadService;
