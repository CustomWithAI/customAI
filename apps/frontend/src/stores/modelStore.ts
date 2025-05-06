import { layerTemplates } from "@/configs/layers";
import { parseLayerConfig } from "@/utils/layer-utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LayerConfig = Record<string, any>;

interface ModelState {
	// Model metadata
	modelName: string;
	setModelName: (name: string) => void;
	modelPurpose: string;
	setModelPurpose: (purpose: string) => void;
	modelVersion: string;
	setModelVersion: (version: string) => void;
	autoSave: boolean;
	setAutoSave: (autoSave: boolean) => void;

	// Layer management
	layers: LayerConfig[];
	addLayer: (templateId: string) => void;
	removeLayer: (index: number) => void;
	updateLayer: (index: number, updatedLayer: LayerConfig) => void;
	importConfig: (configString: string) => boolean;
	setLayers: (layers: LayerConfig[]) => void;

	// Statistics
	getLayerCount: () => Record<string, number>;
	getTotalParameters: () => number;

	// Custom layer management
	addCustomLayer: (
		id: string,
		name: string,
		purpose: string,
		config: LayerConfig,
	) => void;
	customLayerTemplates: Record<string, any>;
}

export const useModelStore = create<ModelState>()(
	persist(
		(set, get) => ({
			// Model metadata
			modelName: "New Neural Network",
			setModelName: (name: string) => set({ modelName: name }),
			modelPurpose: "General",
			setModelPurpose: (purpose: string) => set({ modelPurpose: purpose }),
			modelVersion: "1.0.0",
			setModelVersion: (version: string) => set({ modelVersion: version }),
			autoSave: true,
			setAutoSave: (autoSave: boolean) => set({ autoSave }),

			// Layer management
			layers: [],

			addLayer: (templateId: string) => {
				const template = layerTemplates[templateId];
				if (!template) return;

				set((state) => ({
					layers: [
						...state.layers,
						{
							...template.config,
							name: template.name,
							layerPurpose: template.purposes[0] || "general",
						},
					],
				}));
			},

			removeLayer: (index: number) => {
				set((state) => {
					const newLayers = [...state.layers];
					newLayers.splice(index, 1);
					return { layers: newLayers };
				});
			},

			updateLayer: (index: number, updatedLayer: LayerConfig) => {
				set((state) => {
					const newLayers = [...state.layers];
					newLayers[index] = updatedLayer;
					return { layers: newLayers };
				});
			},

			importConfig: (configString: string) => {
				try {
					const parsedData = JSON.parse(
						configString.replace(/$$/g, '["').replace(/$$/g, '"]'),
					);
					if (Array.isArray(parsedData)) {
						const processedLayers = parsedData.map((layer) =>
							parseLayerConfig(layer),
						);
						set({ layers: processedLayers });
						return true;
					}
					return false;
				} catch (error) {
					console.error(error);
					return false;
				}
			},

			setLayers: (layers: LayerConfig[]) => {
				set({ layers });
			},

			getLayerCount: () => {
				const counts: Record<string, number> = {
					input: 0,
					convolutional: 0,
					pooling: 0,
					flatten: 0,
					dense: 0,
					dropout: 0,
					normalization: 0,
					recurrent: 0,
				};

				for (const layer of get().layers) {
					const keys = Object.keys(layer);
					if (keys.length === 0) return counts;

					const firstKey = keys[0];

					if (firstKey.startsWith("inputLayer")) counts.input++;
					else if (firstKey.startsWith("convolutionalLayer"))
						counts.convolutional++;
					else if (firstKey.startsWith("poolingLayer")) counts.pooling++;
					else if (firstKey.startsWith("flattenLayer")) counts.flatten++;
					else if (firstKey.startsWith("denseLayer")) counts.dense++;
					else if (firstKey.startsWith("dropoutLayer")) counts.dropout++;
					else if (
						firstKey.startsWith("batchNormLayer") ||
						firstKey.startsWith("layerNormLayer")
					)
						counts.normalization++;
					else if (
						firstKey.startsWith("lstmLayer") ||
						firstKey.startsWith("gruLayer")
					)
						counts.recurrent++;
				}

				return counts;
			},

			getTotalParameters: () => {
				let totalParams = 0;
				const layers = get().layers;
				let prevUnits = 0;

				layers.forEach((layer, index) => {
					if (Object.keys(layer)[0]?.startsWith("inputLayer")) {
						prevUnits = layer.inputLayer_batchSize || 0;
						return;
					}

					if (Object.keys(layer)[0]?.startsWith("convolutionalLayer")) {
						const filters = layer.convolutionalLayer_filters || 0;
						const kernelSize = layer.convolutionalLayer_kernelSize || "(3, 3)";
						const kernelDimensions = kernelSize
							.replace(/[()]/g, "")
							.split(",")
							.map((dim: string) => Number.parseInt(dim.trim()));

						const kernelArea = kernelDimensions[0] * kernelDimensions[1];
						totalParams += (kernelArea * prevUnits + 1) * filters;
						prevUnits = filters;
						return;
					}

					if (Object.keys(layer)[0]?.startsWith("poolingLayer")) {
						return;
					}

					if (Object.keys(layer)[0]?.startsWith("flattenLayer")) {
						return;
					}

					if (Object.keys(layer)[0]?.startsWith("denseLayer")) {
						const units = layer.denseLayer_units || 0;
						totalParams += prevUnits * units + units;
						prevUnits = units;
						return;
					}

					if (Object.keys(layer)[0]?.startsWith("dropoutLayer")) {
						return;
					}
				});

				return totalParams;
			},

			customLayerTemplates: {},

			addCustomLayer: (
				id: string,
				name: string,
				purpose: string,
				config: LayerConfig,
			) => {
				set((state) => {
					const customTemplate = {
						name,
						description: `Custom layer: ${name}`,
						category: "custom",
						purposes: [purpose],
						compatibleWith: ["all"],
						config,
					};

					const updatedTemplates = {
						...state.customLayerTemplates,
						[id]: customTemplate,
					};

					const updatedLayers = [
						...state.layers,
						{
							...config,
							layerPurpose: purpose,
						},
					];

					return {
						customLayerTemplates: updatedTemplates,
						layers: updatedLayers,
					};
				});
			},
		}),
		{
			name: "neural-network-config",
		},
	),
);
