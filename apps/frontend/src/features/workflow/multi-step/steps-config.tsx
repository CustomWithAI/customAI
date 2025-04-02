import { presetList } from "@/configs/preset";
import { STEPS } from "@/configs/step-key";
import { DragStoreProvider } from "@/contexts/dragContext";
import { OpenCVProvider } from "@/libs/opencv-providers";
import {
	BetweenHorizontalStart,
	Blend,
	Box,
	FileBox,
	FileChartColumnIncreasing,
	FileDown,
	FileSliders,
	Image,
	PackageSearch,
	Shuffle,
	SquareDashedMousePointer,
	TextSelect,
} from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import { Step1 } from "./step1-details";
import { Step3Page } from "./step2-preset";
import { DatasetPage } from "./step3-dataset";
import { ImagePreprocessingPage } from "./step4-preprocessing";
import { AugmentationPage } from "./step5-augmentation";
import { FeaturePage } from "./step6-feature-extraction";
import { ModelPage } from "./step7-model";
import { ModelConfigPage } from "./step8-model-config";
import { ModelDetailsPage } from "./stepN-model";

type StepConfig = {
	readonly title: string;
	readonly stepTitle: string;
	readonly description: string | null;
	readonly icon: ReactNode | null;
	readonly component: () => React.JSX.Element;
};

export const stepConfig: Record<STEPS, StepConfig> = {
	[STEPS.WorkflowInfo]: {
		title: "Build a workflow",
		stepTitle: "Select workflow type",
		description: "Let's build your new model workflow",
		icon: <PackageSearch />,
		component: () => <Step1 />,
	},
	[STEPS.Dataset]: {
		title: "Import dataset",
		stepTitle: "Import or create a dataset",
		description: null,
		icon: <FileDown />,
		component: () => (
			<DragStoreProvider>
				<DatasetPage />
			</DragStoreProvider>
		),
	},
	[STEPS.Preset]: {
		title: "Workflow preset",
		stepTitle: "Choose Workflow Process",
		description: "Choose train workflow pipeline preset",
		icon: <FileChartColumnIncreasing />,
		component: () => (
			<DragStoreProvider initial={presetList}>
				<Step3Page />
			</DragStoreProvider>
		),
	},
	[STEPS.Preprocessing]: {
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
	[STEPS.Augmentation]: {
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
	[STEPS.FeatureEx]: {
		title: "Feature Extraction",
		stepTitle: "Setup Feature Extraction",
		description: "focus on main feature",
		icon: <TextSelect />,
		component: () => (
			<DragStoreProvider initial={[]}>
				<FeaturePage />
			</DragStoreProvider>
		),
	},
	[STEPS.Model]: {
		title: "Import model",
		stepTitle: "Import or create a model",
		description: "",
		icon: <FileBox />,
		component: () => (
			<DragStoreProvider initial={[]}>
				<ModelPage />
			</DragStoreProvider>
		),
	},
	[STEPS.SetupModel]: {
		title: "Setup Model",
		stepTitle: "Setup Model",
		description: "create custom model",
		icon: <Box />,
		component: () => (
			<DragStoreProvider>
				<ModelPage />
			</DragStoreProvider>
		),
	},
	[STEPS.ModelConfig]: {
		title: "Model Configuration",
		stepTitle: "Model Configuration",
		description: null,
		icon: <FileSliders />,
		component: () => (
			<DragStoreProvider initial={[]}>
				<ModelConfigPage />
			</DragStoreProvider>
		),
	},
	[STEPS.Finish]: {
		title: "Model Details",
		stepTitle: "check workflow requirements",
		description: null,
		icon: <FileSliders />,
		component: () => (
			<DragStoreProvider initial={[]}>
				<ModelDetailsPage />
			</DragStoreProvider>
		),
	},
};
