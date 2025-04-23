import { Content } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { node } from "@/configs/fields/augmentation";
import { presetList } from "@/configs/preset";
import { useDragStore } from "@/contexts/dragContext";
import { TableAugmentationSection } from "@/features/augmentation/section/table";
import { VisualAugmentationSection } from "@/features/augmentation/section/visual";
import {
	useCreateAugmentation,
	useUpdateAugmentation,
} from "@/hooks/mutations/augmentation-api";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { Undefined } from "@/libs/Undefined";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { cn } from "@/libs/utils";
import type { DragColumn } from "@/stores/dragStore";
import { arrayToMetadata, metadataToArray } from "@/utils/formatMetadata";
import { sortedMetadata } from "@/utils/sortMetadata";
import { getStep } from "@/utils/step-utils";
import { formatDate } from "@/utils/to-datetime";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import type { ZodRawShape } from "zod";

export const AugmentationPage = () => {
	const { getQueryParam, setQueryParam, compareQueryParam } = useQueryParam({
		name: "view",
	});
	const viewParam = getQueryParam();
	const { toast } = useToast();

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const {
		data: training,
		isPending: trainingPending,
		isSuccess,
	} = useGetTrainingById(decodeBase64(workflowId), decodeBase64(trainingId), {
		enabled: workflowId !== "" && trainingId !== "",
	});

	const { mutateAsync: updateTraining } = useUpdateTraining();
	const { mutateAsync: createAugmentation } = useCreateAugmentation();
	const { mutateAsync: updateAugmentation } = useUpdateAugmentation();

	const fields = useDragStore((state) => state.fields);
	const onSet = useDragStore((state) => state.onSet);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const hasRunRef = useRef(false);

	useEffect(() => {
		if (isSuccess && training?.data.augmentation && !hasRunRef.current) {
			hasRunRef.current = true;
			const fieldObject = Object.entries(training?.data.augmentation?.data);
			onSet(
				sortedMetadata(
					node(fields, onUpdateMetadata),
					training?.data.augmentation?.data?.priority as string[],
				)
					.map((field) => {
						const find = fieldObject.find(([key, _]) => key === field.type);
						if (!find) return undefined;
						return {
							...field,
							metadata: arrayToMetadata(field.metadata, find[1]),
						};
					})
					.filter(Undefined) as DragColumn<ZodRawShape>[],
			);
		}
	}, [isSuccess, training, fields, onUpdateMetadata, onSet]);

	const handleSubmit = useCallback(async () => {
		const json = fields.reduce(
			(acc, field) => {
				if (!field.type) {
					return acc;
				}
				acc[field.type] = metadataToArray(field.metadata);
				return acc;
			},
			{} as Record<string, any>,
		);
		const priority = Object.keys(json);
		const preProcessFn = training?.data.augmentation
			? updateAugmentation
			: createAugmentation;
		await preProcessFn(
			{
				data: { ...json, priority },
				name: training?.data?.augmentation?.name
					? training?.data.augmentation.name
					: `${training?.data.workflow.name}-${formatDate()}`,
				id: training?.data.augmentation?.id || "",
			},
			{
				onError: (error) => {
					toast({
						title: `Augmentation failed to create: ${error.message}`,
						variant: "destructive",
					});
				},
				onSuccess: async (data) => {
					if (!data?.data.id) {
						toast({
							title: "Augmentation is not existed",
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
							augmentationId: data.data.id,
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
							onError: (error) => {
								toast({
									title: `Augmentation failed to create: ${error.message}`,
									variant: "destructive",
								});
							},
						},
					);
				},
			},
		);
	}, [
		fields,
		createAugmentation,
		onSet,
		setQueryParam,
		toast,
		updateAugmentation,
		training?.data.augmentation,
		training?.data.pipeline,
		training?.data.workflow,
		workflowId,
		updateTraining,
		trainingId,
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
			<div id="tab" className="flex p-1 bg-zinc-100 w-fit space-x-1 rounded-lg">
				<button
					type="button"
					onClick={() => {
						setQueryParam({ params: { view: "blueprint" }, subfix: "#tab" });
					}}
					className={cn("px-4 py-1.5 rounded-md relative", {
						"text-zinc-900": viewParam === "blueprint",
						"text-zinc-500": viewParam !== "blueprint",
					})}
				>
					<Content className="text-sm relative z-10">Blueprint</Content>
					{viewParam === "blueprint" && (
						<motion.div
							layoutId="activeTab"
							className="absolute inset-0 bg-white rounded-md"
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						/>
					)}
				</button>
				<button
					type="button"
					onClick={() => setQueryParam({ params: { view: "table" } })}
					className={cn("px-4 py-1.5 rounded-md relative", {
						"text-zinc-900": viewParam === "table" || viewParam === null,
						"text-zinc-500": viewParam !== "table" || viewParam === null,
					})}
				>
					<Content className="text-sm relative z-10">Table</Content>
					{(viewParam === "table" || viewParam === null) && (
						<motion.div
							layoutId="activeTab"
							className="absolute inset-0 bg-white rounded-md"
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						/>
					)}
				</button>
			</div>
			{compareQueryParam({ value: "table", allowNull: true }) ? (
				<TableAugmentationSection />
			) : null}
			{compareQueryParam({ value: "blueprint" }) ? (
				<VisualAugmentationSection />
			) : null}
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
