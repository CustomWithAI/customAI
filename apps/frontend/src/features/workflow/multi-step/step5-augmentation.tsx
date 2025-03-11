import { Content } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
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
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { cn } from "@/libs/utils";
import { metadataToArray } from "@/utils/formatMetadata";
import { getStep } from "@/utils/step-utils";
import { formatDate } from "@/utils/to-datetime";
import { motion } from "framer-motion";
import { useCallback } from "react";

export const AugmentationPage = () => {
	const { getQueryParam, setQueryParam, compareQueryParam } = useQueryParam({
		name: "view",
	});
	const viewParam = getQueryParam();
	const { toast } = useToast();

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training, isPending: trainingPending } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);

	const { mutateAsync: updateTraining } = useUpdateTraining();
	const { mutateAsync: createAugmentation } = useCreateAugmentation();
	const { mutateAsync: updateAugmentation } = useUpdateAugmentation();

	const fields = useDragStore((state) => state.fields);
	const onSet = useDragStore((state) => state.onSet);
	const onReset = useDragStore((state) => state.onReset);

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
				name: `${training?.data.workflow.name}-${formatDate()}`,
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
							imagePreprocessingId: data.data.id,
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
		onReset,
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
					{viewParam === "table" ||
						(viewParam === null && (
							<motion.div
								layoutId="activeTab"
								className="absolute inset-0 bg-white rounded-md"
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
							/>
						))}
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
