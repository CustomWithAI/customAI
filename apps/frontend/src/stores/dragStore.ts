import type { FormFields, SchemaType } from "@/components/builder/form";
import { deepMerge } from "@/utils/deepMerge";
import { metadataToJSON } from "@/utils/formatMetadata";
import { generateId } from "@/utils/generate-id";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import type { Connection, Edge, XYPosition } from "reactflow";
import type { ZodDiscriminatedUnion, ZodObject, ZodRawShape, z } from "zod";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

export type Metadata = Record<
	string,
	| { type: "Boolean"; value: boolean }
	| { type: "String"; value: string }
	| { type: "Number"; value: number | null }
	| { type: "Object"; value: Record<string, Metadata[string]> }
	| { type: "Position"; value: XYPosition }
>;

export type DragColumn<
	T extends ZodDiscriminatedUnion<string, any> | ZodRawShape = z.ZodRawShape,
> = {
	id: string;
	title: string;
	description: string | null;
	previewClassName?: string;
	imagePreviewUrl?: string;
	inputSchema?: SchemaType<T>;
	inputField?: FormFields<
		z.infer<
			| ZodObject<T extends ZodRawShape ? T : never>
			| ZodDiscriminatedUnion<any, any>
		>
	>[];
	type?: string;
	source?: string;
	target?: string;
	icon?: ReactNode;
	metadata: Metadata;
	editable?: boolean;
	selectable?: boolean;
	draggable?: boolean;
};

type DragAction = {
	onReset: () => void;
	onAdd: (data: DragColumn[] | DragColumn | null) => void;
	onRemove: (id: string) => void;
	onUpdate: (data: Partial<DragColumn>) => void;
	onUpdateValue: (data: {
		id: string;
		metadata: Partial<DragColumn["metadata"]>;
	}) => void;
	onUnCheckAll: () => void;
	onCheckAll: () => void;
	onSwap: (mode: "previous" | "next", id: string) => void;
	onDrag: (event: DragEndEvent) => void;
	onGet: () => Array<DragColumn> | null;
	onGetMetadata: () => Record<string, unknown>;
	onSet: (data: Array<DragColumn>) => void;
	onValidate: () => [error: true, msg: string] | [error: false, msg?: never];
	onNodesChange: (changes: any[]) => void;
	onEdgesChange: (changes: any[]) => void;
	onAddNode: (node: Omit<DragColumn, "source" | "target">) => void;
	onAddEdge: (
		edge: Pick<DragColumn, "id" | "source" | "target" | "metadata">,
	) => void;
	onUpdateMetadata: (payload: {
		id: string;
		metadata: Metadata;
	}) => void;
	onDeleteNode: (nodeId: string) => void;
	onResetNode: (nodeId: string) => void;
};

export type DragInitial = Array<DragColumn>;
export type DragState = {
	fields: Array<DragColumn>;
};
export type DragStore = DragState & DragAction;

const defaultState: Array<DragColumn> = [
	{ id: "1", title: "", description: "", icon: "", metadata: {} },
];

export const createDragStore = (initState = defaultState) => {
	return createStore<DragStore>()(
		immer((set, get) => ({
			fields: initState,
			// Reset to initial state
			onReset: () => set({ fields: initState }),

			// Add a new field
			onAdd: (data: DragColumn[] | DragColumn | null) => {
				if (!data) return;

				set((state) => {
					const itemsToAdd = Array.isArray(data) ? data : [data];
					for (const item of itemsToAdd) {
						if (!state.fields.some((field) => field.id === item.id)) {
							state.fields.push({ ...item, id: item.id || generateId() });
						}
					}
				});
			},

			// Remove a field by ID
			onRemove: (id) =>
				set((state) => {
					state.fields = state.fields.filter((field) => field.id !== id);
				}),

			// Update a field by ID
			onUpdate: (data) =>
				set((state) => {
					const field = state.fields.find((field) => field.id === data.id);
					if (field) Object.assign(field, data);
				}),

			// Update a field only metadata by ID
			onUpdateValue: (data) =>
				set((state) => {
					const field = state.fields.find((field) => field.id === data.id);
					if (field && data.metadata) {
						for (const key of Object.keys(data.metadata)) {
							if (
								field.metadata[key]?.value !== undefined &&
								data.metadata[key]?.value !== undefined
							) {
								field.metadata[key].value = data.metadata[key].value;
							}
						}
					}
				}),

			// Uncheck all fields
			onUnCheckAll: () =>
				set((state) => {
					for (const field of state.fields) {
						if (field.metadata.check?.type === "Boolean") {
							field.metadata.check.value = false;
						}
					}
				}),

			// Check all fields
			onCheckAll: () =>
				set((state) => {
					for (const field of state.fields) {
						if (field.metadata.check?.type === "Boolean") {
							field.metadata.check.value = true;
						}
					}
				}),

			// Swap a field with the previous or next one
			onSwap: (mode, id) =>
				set((state) => {
					const index = state.fields.findIndex((field) => field.id === id);
					if (index === -1) return;

					const swapIndex = mode === "previous" ? index - 1 : index + 1;
					if (swapIndex < 0 || swapIndex >= state.fields.length) return;

					[state.fields[index], state.fields[swapIndex]] = [
						state.fields[swapIndex],
						state.fields[index],
					];
				}),

			// Handle drag-and-drop reordering
			onDrag: (event) =>
				set((state) => {
					const { active, over } = event;
					if (!over || active.id === over.id) return;

					const oldPos = state.fields.findIndex(
						(field) => field.id === active.id,
					);
					const newPos = state.fields.findIndex(
						(field) => field.id === over.id,
					);
					if (oldPos === -1 || newPos === -1) return;

					state.fields = arrayMove(state.fields, oldPos, newPos);
				}),

			// Get all fields
			onGet: () => get().fields,

			onGetMetadata: () => {
				const data = get().fields.reduce(
					(acc, current) => {
						acc[current.title] = metadataToJSON(current.metadata);
						return acc;
					},
					{} as Record<string, unknown>,
				);
				return data;
			},

			// Set all fields
			onSet: (data) => set({ fields: data }),

			// Validate all fields
			onValidate: () => {
				const isValid = get().fields.every((field) => !!field.title);
				return isValid ? [false] : [true, "Some fields are missing a title"];
			},
			// React Flow actions
			onNodesChange: (changes) =>
				set((state) => {
					const updatedFields = state.fields.map((field) => {
						if (!field.source && !field.target) {
							const change = changes.find((c) => c.id === field.id);
							if (change) {
								if (change.type === "position" && change.position) {
									return {
										...field,
										metadata: {
											...field.metadata,
											position: { type: "Position", value: change.position },
										},
									};
								}
								if (change.type === "data" && change.data) {
									return {
										...field,
										metadata: {
											...field.metadata,
											...change.data,
										},
									};
								}
							}
						}
						return field;
					});
					return { fields: updatedFields };
				}),

			onEdgesChange: (changes) =>
				set((state) => {
					const updatedFields = state.fields.map((field) => {
						if (field.source && field.target) {
							const change = changes.find((c) => c.id === field.id);
							if (change) {
								if (change.type === "data" && change.data) {
									return {
										...field,
										metadata: {
											...field.metadata,
											...change.data,
										},
									};
								}
							}
						}
						return field;
					});
					return { fields: updatedFields };
				}),

			// Add a new node to the store
			onAddNode: (node) =>
				set((state) => ({
					fields: [...state.fields, node],
				})),

			// Add a new edge to the store
			onAddEdge: (edge) =>
				set((state) => ({
					fields: [...state.fields, edge],
				})),

			// Update metadata for a node or edge
			onUpdateMetadata: (payload) =>
				set((state) => {
					const updatedFields = state.fields.map((field) => {
						if (field.id === payload.id) {
							return {
								...field,
								metadata: deepMerge(field.metadata, payload.metadata),
							};
						}
						return field;
					});
					return { fields: updatedFields };
				}),

			onDeleteNode: (nodeId) =>
				set((state) => ({
					fields: state.fields.filter((field) => field.id !== nodeId),
				})),

			onResetNode: (nodeId) =>
				set((state) => {
					const updatedFields = state.fields.map((field) => {
						if (field.id === nodeId) {
							return {
								...field,
								metadata: {
									...field.metadata,
									value: { type: "String", value: "" },
								},
							};
						}
						return field;
					});
					return { fields: updatedFields };
				}),
		})),
	);
};
