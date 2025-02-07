import { DragStoreProvider } from "@/contexts/dragContext";
import {
	BetweenHorizontalStart,
	Blend,
	FileChartColumnIncreasing,
	FileDown,
	FileSliders,
	Image,
	PackageSearch,
	Shuffle,
	SquareDashedMousePointer,
} from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import { Step1 } from "./step1-details";
import { Step3Page } from "./step2-preset";
import { Step2 } from "./step3-dataset";
import { ImagePreprocessingPage } from "./step4-preprocessing";
import { AugmentationPage } from "./step5-augmentation";
import { ModelConfigPage } from "./step8-model-config";

type StepConfig = {
	readonly title: string;
	readonly stepTitle: string;
	readonly description: string | null;
	readonly icon: ReactNode | null;
	readonly component: () => React.JSX.Element;
};

export const stepConfig: Record<string, StepConfig> = {
	workflow_info: {
		title: "Build a workflow",
		stepTitle: "Select workflow type",
		description: "Let's build your new model workflow",
		icon: <PackageSearch />,
		component: () => <Step1 />,
	},
	dataset: {
		title: "Import dataset",
		stepTitle: "Import or create a dataset",
		description: null,
		icon: <FileDown />,
		component: () => <Step2 />,
	},
	preset: {
		title: "Workflow preset",
		stepTitle: "Choose Workflow Process",
		description: "Choose train workflow pipeline preset",
		icon: <FileChartColumnIncreasing />,
		component: () => (
			<DragStoreProvider
				initial={[
					{
						title: "Image Pre-processing",
						id: "1",
						metadata: { check: { type: "Boolean", value: false } },
						description: "edit image before training",
						icon: <Image />,
					},
					{
						title: "Feature Selection & Extraction",
						id: "2",
						metadata: { check: { type: "Boolean", value: false } },
						description: "focus on main feature",
						icon: <SquareDashedMousePointer />,
					},
					{
						title: "Data Augmentation",
						id: "3",
						metadata: { check: { type: "Boolean", value: false } },
						description: "create random sampling",
						icon: <BetweenHorizontalStart />,
					},
					{
						title: "Training Configuration",
						id: "4",
						metadata: { check: { type: "Boolean", value: false } },
						description: "setting model hyperparameter",
						icon: <FileSliders />,
					},
				]}
			>
				<Step3Page />
			</DragStoreProvider>
		),
	},
	preprocessing: {
		title: "Image Pre-Processing",
		stepTitle: "Image Pre-Processing",
		description: null,
		icon: <Blend />,
		component: () => (
			<DragStoreProvider initial={[]}>
				<ImagePreprocessingPage />
			</DragStoreProvider>
		),
	},
	augmentation: {
		title: "Data Augmentation",
		stepTitle: "Setup Augmentation",
		description: "Let create variant sample of data",
		icon: <Shuffle />,
		component: () => (
			<DragStoreProvider initial={[]}>
				<AugmentationPage />
			</DragStoreProvider>
		),
	},
	modelconfig: {
		title: "Model Configuration",
		stepTitle: "Model Configuration",
		description: null,
		icon: <FileSliders />,
		component: () => <ModelConfigPage />,
	},
};
