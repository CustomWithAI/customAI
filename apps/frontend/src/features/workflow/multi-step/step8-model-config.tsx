"use client";
import { useFormBuilder } from "@/components/builder/form";
import { Button } from "@/components/ui/button";
import { customModelHyperparameterByType } from "@/configs/customModelHyperparameter";
import { hyperparameterByType } from "@/configs/hyperparameter";
import { machineLearningByType } from "@/configs/ml";
import { presetList } from "@/configs/preset";
import { useDragStore } from "@/contexts/dragContext";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import type { NotNull } from "@/types/common";
import { getStep } from "@/utils/step-utils";
import { useCallback, useMemo } from "react";
import type { z } from "zod";

export const ModelConfigPage = () => {
	const { setQueryParam, getQueryParam } = useQueryParam({ name: "step" });
	const { toast } = useToast();

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training, isPending: trainingPending } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);

	const { mutateAsync: updateTraining } = useUpdateTraining();

	const onSet = useDragStore((state) => state.onSet);

	const hyperparameterField = useMemo(() => {
		if (training?.data.machineLearningModel?.type) {
			return machineLearningByType[training?.data.machineLearningModel.type];
		}
		if (training?.data.preTrainedModel) {
			return hyperparameterByType[training?.data.workflow.type] ?? null;
		}
		if (training?.data.customModel) {
			return (
				customModelHyperparameterByType[training?.data.workflow.type] ?? null
			);
		}
		return null;
	}, [
		training?.data.preTrainedModel,
		training?.data.customModel,
		training?.data.workflow,
		training?.data.machineLearningModel,
	]);

	const handlePrevious = useCallback(async () => {
		if (!training?.data.pipeline.steps || !training?.data.pipeline.current)
			return;
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
				onSuccess: (t) => {
					setQueryParam({
						params: {
							step: encodeBase64(t?.data?.pipeline?.current || ""),
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

	const onSubmitData = useCallback(
		async (data: z.infer<NotNull<typeof hyperparameterField>["schema"]>) => {
			if (!training?.data.pipeline.steps) return;
			await updateTraining(
				{
					workflowId: decodeBase64(workflowId),
					trainingId: decodeBase64(trainingId),
					...(training?.data.machineLearningModel?.type
						? {
								machineLearningModel: {
									type: training?.data.machineLearningModel.type,
									model: data,
								},
							}
						: training?.data.preTrainedModel || training?.data.customModel
							? { hyperparameter: data }
							: {}),
					pipeline: {
						current: getStep(
							"next",
							training?.data.pipeline.current,
							training?.data.pipeline.steps,
							() => onSet(presetList),
						),
						steps: training?.data.pipeline.steps,
					},
				},
				{
					onSuccess: (t) => {
						setQueryParam({
							params: {
								step: encodeBase64(t?.data?.pipeline?.current || ""),
								id: workflowId,
								trainings: trainingId,
							},
							resetParams: true,
						});
					},
				},
			);
		},
		[
			updateTraining,
			training?.data.pipeline,
			onSet,
			training?.data.machineLearningModel,
			training?.data.preTrainedModel,
			training?.data.customModel,
			workflowId,
			trainingId,
			setQueryParam,
		],
	);

	const { Provider, Build } = useFormBuilder({
		status: trainingPending,
		defaultValues:
			training?.data?.machineLearningModel?.model ||
			training?.data?.hyperparameter,
		schema: hyperparameterField?.schema,
		onSubmit: onSubmitData,
		formName: "create-Step1-id",
	});

	return (
		<Provider>
			<Build formFields={hyperparameterField?.formField} />
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button
					disabled={trainingPending}
					onClick={async () => await handlePrevious()}
					type="button"
					variant="ghost"
				>
					Previous
				</Button>
				<Button type="submit">Next</Button>
			</div>
		</Provider>
	);
};
