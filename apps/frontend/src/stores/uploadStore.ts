import { create } from "zustand";

type UploadState = {
	uploads: {
		id: string;
		filename: string;
		file: File;
		progress: number;
		error?: boolean;
		completed: boolean;
		abortController: AbortController;
	}[];
	addUpload: (file: {
		id: string;
		file: File;
		filename: string;
		abortController: AbortController;
	}) => void;
	resetUpload: () => void;
	updateProgress: (id: string, progress: number) => void;
	updateError: (id: string) => void;
	completeUpload: (id: string) => void;
	cancelUpload: (id: string) => void;
};

export const useUploadStore = create<UploadState>((set) => ({
	uploads: [],
	resetUpload: () =>
		set(() => ({
			uploads: [],
		})),
	addUpload: (file) =>
		set((state) => ({
			uploads: [...state.uploads, { ...file, progress: 0, completed: false }],
		})),
	updateProgress: (id, progress) =>
		set((state) => ({
			uploads: state.uploads.map((upload) =>
				upload.id === id ? { ...upload, progress } : upload,
			),
		})),
	completeUpload: (id) =>
		set((state) => ({
			uploads: state.uploads.map((upload) =>
				upload.id === id ? { ...upload, completed: true } : upload,
			),
		})),
	updateError: (id) =>
		set((state) => ({
			uploads: state.uploads.map((upload) =>
				upload.id === id ? { ...upload, error: true } : upload,
			),
		})),
	cancelUpload: (id) =>
		set((state) => ({
			uploads: state.uploads.filter((upload) => upload.id !== id),
		})),
}));
