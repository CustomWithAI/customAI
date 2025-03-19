import type { DragColumn } from "@/stores/dragStore";
import {
	BetweenHorizontalStart,
	FileSliders,
	Image,
	SquareDashedMousePointer,
} from "lucide-react";
import { STEPS } from "./step-key";

export const presetList: DragColumn[] = [
	{
		title: "Image Pre-processing",
		id: "1",
		metadata: {
			check: { type: "Boolean", value: false },
			name: { type: "String", value: STEPS.Preprocessing },
		},
		description: "edit image before training",
		icon: <Image />,
	},
	{
		title: "Feature Selection & Extraction",
		id: "2",
		metadata: {
			check: { type: "Boolean", value: false },
			name: { type: "String", value: STEPS.FeatureEx },
		},
		description: "focus on main feature",
		icon: <SquareDashedMousePointer />,
	},
	{
		title: "Data Augmentation",
		id: "3",
		metadata: {
			check: { type: "Boolean", value: false },
			name: { type: "String", value: STEPS.Augmentation },
		},
		description: "create random sampling",
		icon: <BetweenHorizontalStart />,
	},
	{
		title: "Training Configuration",
		id: "4",
		metadata: {
			check: { type: "Boolean", value: false },
			name: { type: "String", value: STEPS.ModelConfig },
		},
		description: "setting model hyperparameter",
		icon: <FileSliders />,
	},
];
