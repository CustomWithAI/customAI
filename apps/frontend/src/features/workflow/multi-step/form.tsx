"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { Primary, Subtle } from "@/components/typography/text";
import { SelectiveBar } from "@/components/ui/selectiveBar";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { stepConfig } from "./steps-config";

export const MultiStepForm = () => {
	const t = useTranslations();
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "step" });
	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);
	const currentStep = decodeBase64(getQueryParam()) || "workflow_info";

	const CurrentStepComponent = useMemo(() => {
		return stepConfig[currentStep as keyof typeof stepConfig];
	}, [currentStep]);

	const currentIndex = () => {
		if (currentStep === "workflow_info") {
			return 1;
		}
		if (currentStep === "preset") {
			return 2;
		}
		if (currentStep === "dataset") {
			return 3;
		}
		const pipelineStep = training?.data.pipeline.steps.find(
			(step) => step.name === currentStep,
		)?.index;
		if (pipelineStep !== undefined) {
			return pipelineStep + 4;
		}
		if (pipelineStep === "start") {
			return training?.data.pipeline.steps.length || 0 + 4;
		}
		return 6;
	};

	if (!CurrentStepComponent) return;
	return (
		<AppNavbar
			activeTab="Home"
			PageTitle={"create a workflow"}
			disabledTab={undefined}
		>
			<SelectiveBar
				total={
					training?.data.pipeline.steps
						? 4 + training?.data.pipeline.steps.length
						: 4
				}
				current={currentIndex()}
				title={CurrentStepComponent.title}
				icon={CurrentStepComponent.icon}
			/>
			{CurrentStepComponent.description && (
				<Subtle className="-mt-2 mb-3">
					{CurrentStepComponent.description}
				</Subtle>
			)}
			{CurrentStepComponent.component()}
		</AppNavbar>
	);
};
