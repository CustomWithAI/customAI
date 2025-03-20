import { type FormFieldInput, useFormBuilder } from "@/components/builder/form";
import { Content, SubHeader } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { MODEL_TYPE } from "@/configs/model-type";
import { presetList } from "@/configs/preset";
import { useDragStore } from "@/contexts/dragContext";
import { ModelCard } from "@/features/model/components/card";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetEnum } from "@/hooks/queries/enum-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { type ModelSetupDetails, modelSetupDetails } from "@/models/modelSetup";
import { getArrayFromEnum } from "@/utils/array-from-enum";
import { getStep } from "@/utils/step-utils";
import { useCallback } from "react";

export const ModelSetupPage = () => {
	const { setQueryParam, getQueryParam } = useQueryParam({ name: "step" });
	const { toast } = useToast();

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training, isPending: trainingPending } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);

	const { mutateAsync: updateTraining, isPending: updatePending } =
		useUpdateTraining();

	const onSet = useDragStore((state) => state.onSet);

	const onSubmitData = async (data: ModelSetupDetails) => {
		await updateTraining(
			{
				workflowId: decodeBase64(workflowId),
				trainingId: decodeBase64(trainingId),
				...data,
			},
			{
				onError: (e) => {
					toast({ title: e.message });
					return;
				},
				onSuccess: (t) => {
					if (!t) {
						toast({ title: "No data inside workflow" });
						return;
					}
					setQueryParam({
						params: {
							step: encodeBase64("preset"),
							id: workflowId,
							trainings: trainingId,
						},
						resetParams: true,
					});
				},
			},
		);
	};
	const handlePrevious = useCallback(async () => {
		if (!training?.data.pipeline.steps) return;
		await updateTraining(
			{
				workflowId: decodeBase64(workflowId),
				trainingId: decodeBase64(trainingId),
				pipeline: {
					current: getStep(
						"prev",
						training?.data.pipeline.current,
						training?.data.pipeline.steps,
						() => onSet(presetList),
					),
					steps: training?.data.pipeline.steps,
				},
			},
			{
				onSuccess: () => {
					setQueryParam({
						params: {
							step: encodeBase64(
								getStep(
									"prev",
									training?.data.pipeline.current,
									training?.data.pipeline.steps,
									() => onSet(presetList),
								),
							),
							id: workflowId,
							trainings: trainingId,
						},
						resetParams: true,
					});
				},
			},
		);
	}, [
		setQueryParam,
		workflowId,
		trainingId,
		onSet,
		updateTraining,
		training?.data.pipeline,
	]);

	const { Provider, Build } = useFormBuilder({
		schema: modelSetupDetails,
		onSubmit: onSubmitData,
		formName: "create-Step1-id",
	});
	return (
		<Provider>
			<Build
				formFields={[
					{
						template: "text",
						element: {
							label: "Workflow Name",
							key: "workflow-name",
							name: "name",
							placeholder: "Eg., 'Dog or Cat' or 'Flower varieties'",
						},
						config: {},
					},
				]}
			/>
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button
					disabled={updatePending}
					onClick={async () => await handlePrevious()}
					variant="ghost"
				>
					Previous
				</Button>
				<Button disabled={updatePending} type="submit">
					Next
				</Button>
			</div>
		</Provider>
	);
};
