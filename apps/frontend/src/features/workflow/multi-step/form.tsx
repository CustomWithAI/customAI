import { AppNavbar } from "@/components/layout/appNavbar";
import { Primary, Subtle } from "@/components/typography/text";
import { SelectiveBar } from "@/components/ui/selectiveBar";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64 } from "@/libs/base64";
import { useMemo } from "react";
import { stepConfig } from "./steps-config";

export const MultiStepForm = () => {
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "step" });
	const CurrentStepComponent = useMemo(() => {
		const currentStep = decodeBase64(getQueryParam());
		return stepConfig[currentStep as keyof typeof stepConfig];
	}, [getQueryParam]);

	return (
		<AppNavbar
			activeTab="Home"
			PageTitle="Create Workflow"
			disabledTab={undefined}
		>
			<Primary className="mb-4">{CurrentStepComponent.title}</Primary>
			<SelectiveBar
				total={Object.entries(stepConfig).length}
				current={3}
				title={CurrentStepComponent.title}
				icon={CurrentStepComponent.icon}
			/>
			<Subtle>{CurrentStepComponent.description}</Subtle>
			{CurrentStepComponent.component()}
		</AppNavbar>
	);
};
