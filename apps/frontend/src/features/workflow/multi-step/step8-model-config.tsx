"use client";
import { type FormFieldInput, useFormBuilder } from "@/components/builder/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import {
	ClassificationParams,
	ObjectDetectionParams,
	SegmentationParams,
} from "@/configs/hyperparameter";
import { presetList } from "@/configs/preset";
import { workflowEnum } from "@/configs/workflow-type";
import { useDragStore } from "@/contexts/dragContext";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import {
	classificationSchema,
	objectDetectionSchema,
	segmentationSchema,
} from "@/models/model-config";
import type { NotNull } from "@/types/common";
import { getStep } from "@/utils/step-utils";
import { useCallback, useMemo } from "react";
import type { ZodObject, z } from "zod";

const hyperparameterByType: Record<
	string,
	{ formField: FormFieldInput<any>; schema: ZodObject<any> }
> = {
	[workflowEnum.ObjectDetection]: {
		formField: ObjectDetectionParams,
		schema: objectDetectionSchema,
	},
	[workflowEnum.Classification]: {
		formField: ClassificationParams,
		schema: classificationSchema,
	},
	[workflowEnum.Segmentation]: {
		formField: SegmentationParams,
		schema: segmentationSchema,
	},
};
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
		if (training?.data.preTrainedModel) {
			return hyperparameterByType[training?.data.workflow.type || ""] ?? null;
		}
		return null;
	}, [training?.data.preTrainedModel, training?.data.workflow]);

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

	const onSubmitData = useCallback(
		async (data: z.infer<NotNull<typeof hyperparameterField>["schema"]>) => {
			if (!training?.data.pipeline.steps) return;
			await updateTraining(
				{
					workflowId: decodeBase64(workflowId),
					trainingId: decodeBase64(trainingId),
					hyperparameter: data,
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
					onSuccess: () => {
						setQueryParam({
							params: {
								step: encodeBase64(
									getStep(
										"next",
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
		},
		[
			updateTraining,
			training?.data.pipeline,
			onSet,
			workflowId,
			trainingId,
			setQueryParam,
		],
	);

	const { Provider, Build } = useFormBuilder({
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
					variant="ghost"
				>
					Previous
				</Button>
				<Button type="submit">Next</Button>
			</div>
		</Provider>
	);
};
