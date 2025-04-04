import { basicLayers } from "./basicLayers";
import { convLayers } from "./convLayers";
import { customLayers } from "./customLayers";
import { normalizationLayers } from "./normalizationLayers";
import { recurrentLayers } from "./recurrentLayers";
import { specializedLayers } from "./specializedLayers";

export const layerTemplates = {
	...basicLayers,
	...convLayers,
	...normalizationLayers,
	...recurrentLayers,
	...specializedLayers,
	...customLayers,
};

export type LayerTemplate = {
	name: string;
	description: string;
	category: string;
	purposes: string[];
	compatibleWith: string[];
	config: Record<string, any>;
};
