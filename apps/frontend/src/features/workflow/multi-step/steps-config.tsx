import { PackageSearch } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import { Step1 } from "./step1";

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
};
