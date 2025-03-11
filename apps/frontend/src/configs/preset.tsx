import type { DragColumn } from "@/stores/dragStore";
import {
	BetweenHorizontalStart,
	FileSliders,
	Image,
	SquareDashedMousePointer,
} from "lucide-react";

export const presetList: DragColumn[] = [
	{
		title: "Image Pre-processing",
		id: "1",
		metadata: {
			check: { type: "Boolean", value: false },
			name: { type: "String", value: "preprocessing" },
		},
		description: "edit image before training",
		icon: <Image />,
	},
	{
		title: "Feature Selection & Extraction",
		id: "2",
		metadata: {
			check: { type: "Boolean", value: false },
			name: { type: "String", value: "featureEx" },
		},
		description: "focus on main feature",
		icon: <SquareDashedMousePointer />,
	},
	{
		title: "Data Augmentation",
		id: "3",
		metadata: {
			check: { type: "Boolean", value: false },
			name: { type: "String", value: "augmentation" },
		},
		description: "create random sampling",
		icon: <BetweenHorizontalStart />,
	},
	{
		title: "Training Configuration",
		id: "4",
		metadata: {
			check: { type: "Boolean", value: false },
			name: { type: "String", value: "modelconfig" },
		},
		description: "setting model hyperparameter",
		icon: <FileSliders />,
	},
];
