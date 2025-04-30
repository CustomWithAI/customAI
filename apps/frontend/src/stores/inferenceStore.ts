import type { FileMetadata } from "@/hooks/use-file-upload";
import { create } from "zustand";

export type InferenceColumn = {
	workflow: string | undefined;
	training: string | undefined;
	version: string | undefined;
	image: File | FileMetadata | undefined;
	model: File | FileMetadata | undefined;
	workflowId: string | undefined;
	trainingId: string | undefined;
};

export type InferenceAction = {
	onSet: <K extends keyof InferenceColumn>(
		key: K,
		value: InferenceColumn[K],
	) => void;
	onSetFilter: <K extends keyof InferenceFilter>(
		key: K,
		value: InferenceFilter[K],
	) => void;
	onRemoveFilter: <K extends keyof InferenceFilter>(key: K) => void;
	onClear: () => void;
};

export type InferenceFilter = {
	workflow: string | undefined;
	training: string | undefined;
};

export const initialInferenceState: InferenceColumn = {
	workflow: undefined,
	training: undefined,
	version: undefined,
	image: undefined,
	model: undefined,
	workflowId: undefined,
	trainingId: undefined,
};

export const initialInferenceFilter: InferenceFilter = {
	workflow: undefined,
	training: undefined,
};

export type InferenceState = {
	data: InferenceColumn;
	filter: InferenceFilter;
} & InferenceAction;

export const useInferenceStore = create<InferenceState>((set) => ({
	data: initialInferenceState,
	filter: initialInferenceFilter,
	onSet: (key, value) =>
		set((state) => ({
			...state,
			data: { ...state.data, [key]: value },
		})),
	onSetFilter: (key, value) =>
		set((state) => ({
			...state,
			filter: { ...state.filter, [key]: value },
		})),
	onRemoveFilter: (key) =>
		set((state) => ({
			...state,
			filter: {
				...state.filter,
				[key]: (initialInferenceFilter as Record<string, any>)[key],
			},
		})),
	onClear: () => set((state) => ({ ...state, data: initialInferenceState })),
}));
