import { Button } from "@/components/ui/button";
import { presetList } from "@/configs/preset";
import { useDragStore } from "@/contexts/dragContext";
import {
	type ModelConfigData,
	ModelConfigEditor,
	type ModelConfigRef,
} from "@/features/model/sections/modelConfigEditor";
import {
	useCreateCustomModel,
	useUpdateCustomModel,
} from "@/hooks/mutations/customModel-api";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import type { LayerConfig } from "@/stores/modelStore";
import { removeKey } from "@/utils/removerKey";
import { getStep } from "@/utils/step-utils";
import { formatDate } from "@/utils/to-datetime";
import { useCallback, useRef, useState } from "react";

export const ModelSetupPage = () => {
	const { getQueryParam, setQueryParam, compareQueryParam } = useQueryParam({
		name: "view",
	});
	const modelRef = useRef<ModelConfigRef>(null);
	const { toast } = useToast();

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const {
		data: training,
		isPending: trainingPending,
		isSuccess,
	} = useGetTrainingById(decodeBase64(workflowId), decodeBase64(trainingId), {
		enabled: workflowId !== "" && trainingId !== "",
	});

	const [lastOperation, setLastOperation] = useState<{
		type: "import" | "export" | "submit";
		timestamp: number;
		data?: LayerConfig[] | ModelConfigData;
	} | null>(null);

	const onSet = useDragStore((state) => state.onSet);

	const { mutateAsync: createCustom } = useCreateCustomModel();
	const { mutateAsync: updateCustom } = useUpdateCustomModel();
	const { mutateAsync: updateTraining } = useUpdateTraining();

	const onReset = useDragStore((state) => state.onReset);

	const handleSubmit = useCallback(async () => {
		const customFn = training?.data?.customModel ? updateCustom : createCustom;
		const data = modelRef.current?.getData();
		await customFn(
			{
				data: {
					data: { model: removeKey(data?.layers as [], "layerPurpose") },
				},
				name: `${training?.data.workflow.name}-${formatDate()}`,
				type: training?.data.workflow.type,
				id: training?.data.customModel?.id || "",
			},
			{
				onError: (error) => {
					toast({
						title: `custom-model failed to create: ${error.message}`,
						variant: "destructive",
					});
				},
				onSuccess: async (data) => {
					if (!data?.data.id) {
						toast({
							title: "custom-model is not existed",
							variant: "destructive",
						});
						return;
					}
					if (!training?.data.pipeline) {
						toast({
							title: "trainings is not existed",
							variant: "destructive",
						});
						return;
					}
					await updateTraining(
						{
							workflowId: decodeBase64(workflowId),
							trainingId: decodeBase64(trainingId),
							customModelId: data.data.id,
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
								onReset();
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
							onError: (error) => {
								toast({
									title: `custom-model failed to create: ${error.message}`,
									variant: "destructive",
								});
							},
						},
					);
				},
			},
		);
	}, [
		setQueryParam,
		trainingId,
		workflowId,
		training?.data.pipeline,
		updateCustom,
		training?.data.customModel,
		updateTraining,
		toast,
		onSet,
		onReset,
		training?.data.workflow,
		createCustom,
	]);

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

	return (
		<>
			{lastOperation && (
				<div className="mb-4 p-2 bg-muted rounded-md text-sm">
					<p>
						Last operation: <strong>{lastOperation.type}</strong> at{" "}
						{new Date(lastOperation.timestamp).toLocaleTimeString()}
					</p>
					<p>
						{lastOperation.type === "submit"
							? `Model: ${(lastOperation.data as ModelConfigData).name}`
							: `Layers: ${(lastOperation.data as LayerConfig[])?.length || 0}`}
					</p>
				</div>
			)}
			<ModelConfigEditor
				ref={modelRef}
				modelType={training?.data?.workflow?.type}
				defaultValue={{
					layers: training?.data?.customModel?.data?.model as LayerConfig[],
				}}
				status={trainingPending ? "loading" : "idle"}
			/>
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button
					disabled={trainingPending}
					onClick={async () => await handlePrevious()}
					variant="ghost"
				>
					Previous
				</Button>
				<Button disabled={trainingPending} onClick={handleSubmit} type="submit">
					Next
				</Button>
			</div>
		</>
	);
};
