import { BaseSkeleton } from "@/components/specific/skeleton";
import { Content, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MODEL_TYPE } from "@/configs/model-type";
import { presetList } from "@/configs/preset";
import { STEPS } from "@/configs/step-key";
import { useDragStore } from "@/contexts/dragContext";
import { ModelCard } from "@/features/model/components/card";
import {
	useCreateTraining,
	useUpdateTraining,
} from "@/hooks/mutations/training-api";
import { useGetEnum } from "@/hooks/queries/enum-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { encodeBase64 } from "@/libs/base64";
import { getArrayFromEnum } from "@/utils/array-from-enum";
import { addStepAfterName, getStep } from "@/utils/step-utils";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { MODEL_KEYWORD } from "../../../configs/model";
import { decodeBase64 } from "../../../libs/base64";
import { cn } from "../../../libs/utils";

export const ModelPage = () => {
	const [modelId, setModelId] = useState<string | null>(null);
	const [machineLearning, setMachineLearning] = useState<{
		type: string;
		model: Record<string, any>;
	} | null>(null);
	const { toast } = useToast();
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "id" });

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training, isPending: trainingPending } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);
	const { data: enumModel, isPending: enumModelPending } = useGetEnum();

	const { mutateAsync: updateTraining, isPending: updatePending } =
		useUpdateTraining();

	const enumModelByType = getArrayFromEnum(enumModel?.data, [
		"preTrainedModel",
		"deepLearning",
		training?.data.workflow.type,
	]);

	const enumMachineLearningByType = getArrayFromEnum(enumModel?.data, [
		"preTrainedModel",
		"machineLearning",
		training?.data.workflow.type,
	]);

	const onSet = useDragStore((state) => state.onSet);

	const handleCreateModel = useCallback(async () => {
		if (!training?.data.pipeline) {
			toast({
				title: "trainings is not existed",
				variant: "destructive",
			});
			return;
		}
		const newPipeline = addStepAfterName(
			training?.data.pipeline.steps,
			STEPS.Model,
			{ name: STEPS.SetupModel },
		);

		await updateTraining(
			{
				workflowId: decodeBase64(workflowId),
				trainingId: decodeBase64(trainingId),
				pipeline: {
					current: getStep(
						"next",
						training?.data.pipeline.current,
						newPipeline,
						() => onSet(presetList),
					),
					steps: newPipeline,
				},
			},
			{
				onSuccess: (t) => {
					setQueryParam({
						params: {
							step: encodeBase64(t?.data.pipeline.current || ""),
							id: workflowId,
							trainings: trainingId,
						},
						resetParams: true,
					});
				},
				onError: (error) => {
					toast({ title: error.message, variant: "destructive" });
				},
			},
		);
	}, [
		toast,
		training?.data.pipeline,
		onSet,
		setQueryParam,
		trainingId,
		updateTraining,
		workflowId,
	]);

	const handleSubmit = useCallback(async () => {
		if (!modelId && !machineLearning) return;
		const modelJSON = enumModelByType?.includes(modelId)
			? { preTrainedModel: modelId }
			: { customModelId: modelId };
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
				...modelJSON,
				...(machineLearning ? { machineLearningModel: machineLearning } : {}),
				pipeline: {
					current: getStep(
						"next",
						training?.data.pipeline.current,
						training?.data.pipeline.steps,
						() => onSet(presetList),
					),
					steps: training?.data?.pipeline?.steps,
				},
			},
			{
				onSuccess: (t) => {
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
					toast({ title: error.message, variant: "destructive" });
				},
			},
		);
	}, [
		setQueryParam,
		modelId,
		onSet,
		training?.data,
		workflowId,
		trainingId,
		machineLearning,
		enumModelByType,
		toast,
		updateTraining,
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
		<div className="flex flex-col gap-y-4">
			<Content>Pre-Trained Models</Content>
			<Subtle className="-mt-4">
				Ready-to-use popular{" "}
				<strong className="font-semibold">
					{training?.data.workflow.type.split("_").join(" ")}
				</strong>{" "}
				models pre-trained.
			</Subtle>
			<BaseSkeleton loading={enumModelPending}>
				<Virtuoso
					className="w-full h-[270px]"
					data={enumModelByType || []}
					horizontalDirection
					itemContent={(_, model) => {
						const { type, description, typeClass } = MODEL_KEYWORD[model] ?? {
							type: "new",
							description: "new model that isn't implemented yet",
							typeClass: "text-zinc-500 bg-zinc-100",
						};
						return (
							<ModelCard
								key={model}
								title={model}
								type={type}
								typeClass={typeClass}
								description={description}
								className={cn(
									modelId === model ? "border border-green-400" : "",
									"first:ml-0 mx-4 w-fit",
								)}
								onClick={() => {
									setMachineLearning(null);
									setModelId(model);
								}}
								images={[]}
							/>
						);
					}}
				/>
			</BaseSkeleton>
			<BaseSkeleton loading={enumModelPending}>
				<>
					{(!enumMachineLearningByType ||
						enumMachineLearningByType?.length > 0) && (
						<>
							<Content>Machine Learning Models</Content>
							<Subtle className="-mt-4">
								Requires few parameters for tuning.
							</Subtle>
						</>
					)}
					<Virtuoso
						className="w-full h-[270px]"
						data={enumMachineLearningByType || []}
						horizontalDirection
						itemContent={(_, model) => {
							const { type, description, typeClass } = MODEL_TYPE[
								model?.key
							] ?? {
								type: "new",
								description: "new model that isn't implemented yet",
								typeClass: "text-zinc-500 bg-zinc-100",
							};
							return (
								<ModelCard
									key={model?.key}
									title={model?.key}
									type={type}
									typeClass={typeClass}
									description={description}
									className={cn(
										machineLearning?.type === model?.key
											? "border border-green-400"
											: "",
										"first:ml-0 mx-4 w-fit",
									)}
									onClick={() => {
										setModelId(null);
										setMachineLearning({
											type: model?.key,
											model: model?.value,
										});
									}}
									images={[]}
								/>
							);
						}}
					/>
				</>
			</BaseSkeleton>
			<Content>Custom Models</Content>
			<Subtle className="-mt-4">
				Build your own model tailored to your needs.
			</Subtle>
			<button
				type="button"
				onClick={async () => await handleCreateModel()}
				className="w-64 h-48 hover:border-blue-700 hover:bg-zinc-50 hover:shadow-xs duration-150 active:scale-95 transition-transform border border-gray-200 rounded-lg flex flex-col justify-center items-center"
			>
				<Plus className="mb-6" />
				<Content>Create a model</Content>
				<Subtle className="text-center">Start on custom model</Subtle>
			</button>
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button
					disabled={updatePending}
					onClick={handlePrevious}
					variant="ghost"
				>
					Previous
				</Button>
				<Button disabled={updatePending} onClick={handleSubmit} type="submit">
					Next
				</Button>
			</div>
		</div>
	);
};
