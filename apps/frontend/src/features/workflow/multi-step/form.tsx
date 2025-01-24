"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { Primary, Subtle } from "@/components/typography/text";
import { SelectiveBar } from "@/components/ui/selectiveBar";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { stepConfig } from "./steps-config";

export const MultiStepForm = () => {
	const t = useTranslations();
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "step" });
	const CurrentStepComponent = useMemo(() => {
		const currentStep = decodeBase64(getQueryParam()) || "workflow_info";
		return stepConfig[currentStep as keyof typeof stepConfig];
	}, [getQueryParam]);
	if (!CurrentStepComponent) return;
	return (
		<AppNavbar
			activeTab="Home"
			PageTitle={"create a workflow"}
			disabledTab={undefined}
		>
			<SelectiveBar
				total={Object.entries(stepConfig).length}
				current={2}
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
