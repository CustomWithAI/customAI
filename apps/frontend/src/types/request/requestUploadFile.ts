export type RequestUploadFileData = {
	file: File;
	progressCallbackFn: (progressEvent: number) => void;
	purpose: string;
};
