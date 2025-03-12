"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { Primary, Subtle } from "@/components/typography/text";
import { SelectiveBar } from "@/components/ui/selectiveBar";
import { StepKey } from "@/configs/step-key";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
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

	const currentIndex = useCallback(() => {
		if (currentStep === StepKey.WorkflowInfo) {
			return 1;
		}
		if (currentStep === StepKey.Preset) {
			return 2;
		}
		if (currentStep === StepKey.Dataset) {
			return 3;
		}
		if (currentStep === StepKey.Finish) {
			return (training?.data.pipeline.steps.length || 0) + 4;
		}
		const pipelineStep = training?.data.pipeline.steps.find(
			(step) => step.name === currentStep,
		)?.index;

		if (pipelineStep !== undefined) {
			return pipelineStep + 4;
		}
		return 6;
	}, [currentStep, training?.data.pipeline]);

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
