import { presetList } from "@/configs/preset";
import { DragStoreProvider } from "@/contexts/dragContext";
import { OpenCVProvider } from "@/libs/opencv-providers";
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
		component: () => (
			<DragStoreProvider>
				<DatasetPage />
			</DragStoreProvider>
		),
	},
	preset: {
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
	featureEx: {
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
	modelconfig: {
		title: "Model Configuration",
		stepTitle: "Model Configuration",
		description: null,
		icon: <FileSliders />,
		component: () => <ModelConfigPage />,
	},
};
