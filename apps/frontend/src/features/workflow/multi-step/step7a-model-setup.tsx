import { Content } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { node } from "@/configs/image-preprocessing";
import { presetList } from "@/configs/preset";
import { useDragStore } from "@/contexts/dragContext";
import { TablePreprocessingSection } from "@/features/image-preprocessing/sections/table";
import { VisualPreprocessingSection } from "@/features/image-preprocessing/sections/visual";
import {
	useCreatePreprocessing,
	useUpdatePreprocessing,
} from "@/hooks/mutations/preprocess-api";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { cn } from "@/libs/utils";
import type { DragColumn } from "@/stores/dragStore";
import {
	arrayToMetadata,
	metadataToArray,
	metadataToJSON,
} from "@/utils/formatMetadata";
import { getStep } from "@/utils/step-utils";
import { formatDate } from "@/utils/to-datetime";
import { keyframes, motion } from "framer-motion";
import { StepBack } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ZodRawShape } from "zod";
import { useShallow } from "zustand/react/shallow";

export const ModelPage = () => {
	const { getQueryParam, setQueryParam, compareQueryParam } = useQueryParam({
		name: "view",
	});
	const viewParam = getQueryParam();
	const { toast } = useToast();

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training, isSuccess } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);

	const onSet = useDragStore((state) => state.onSet);
	const fields = useDragStore(useShallow((state) => state.fields));
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const hasRunRef = useRef(false);

	useEffect(() => {
		if (isSuccess && training?.data.imagePreprocessing && !hasRunRef.current) {
			hasRunRef.current = true;
			onSet(
				node(fields, onUpdateMetadata)
					.map((field) => {
						const find = Object.entries(
							training?.data.imagePreprocessing?.data,
						).find(([key, value]) => key === field.id);
						if (!find) return undefined;
						return {
							...field,
							metadata: arrayToMetadata(field.metadata, find?.[1]),
						};
					})
					.filter((field) => field !== undefined) as DragColumn<ZodRawShape>[],
			);
		}
	}, [isSuccess, training, fields, onUpdateMetadata, onSet]);

	const { mutateAsync: createPreprocess } = useCreatePreprocessing();
	const { mutateAsync: updatePreprocess } = useUpdatePreprocessing();
	const { mutateAsync: updateTraining } = useUpdateTraining();

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
		const preProcessFn = training?.data.imagePreprocessing
			? updatePreprocess
			: createPreprocess;
		await preProcessFn(
			{
				data: { ...json, priority },
				name: `${training?.data.workflow.name}-${formatDate()}`,
				id: training?.data.imagePreprocessing?.id || "",
			},
			{
				onError: (error) => {
					toast({
						title: `Image-processing failed to create: ${error.message}`,
						variant: "destructive",
					});
				},
				onSuccess: async (data) => {
					if (!data?.data.id) {
						toast({
							title: "Image-processing is not existed",
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
									title: `Image-processing failed to create: ${error.message}`,
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
		fields,
		training?.data.pipeline,
		updatePreprocess,
		training?.data.imagePreprocessing,
		updateTraining,
		toast,
		onSet,
		onReset,
		training?.data.workflow,
		createPreprocess,
	]);

	const handlePrevious = useCallback(() => {
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
	}, [setQueryParam, workflowId, trainingId, onSet, training?.data.pipeline]);

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
						"text-zinc-500": viewParam !== "table" || viewParam !== null,
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
				<TablePreprocessingSection />
			) : null}
			{compareQueryParam({ value: "blueprint" }) ? (
				<VisualPreprocessingSection />
			) : null}
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button onClick={handlePrevious} variant="ghost">
					Previous
				</Button>
				<Button onClick={async () => await handleSubmit()} type="submit">
					Next
				</Button>
			</div>
		</>
	);
};
