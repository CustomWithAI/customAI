import { Content } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { node } from "@/configs/feat-extract";
import { presetList } from "@/configs/preset";
import { useDragStore } from "@/contexts/dragContext";
import { TableFeatureExSection } from "@/features/feature-ex/table";
import { VisualFeatureExSection } from "@/features/feature-ex/visual";
import {
	useCreateFeatureEx,
	useUpdateFeatureEx,
} from "@/hooks/mutations/feature-ex-api";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { Undefined } from "@/libs/Undefined";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { cn } from "@/libs/utils";
import type { DragColumn } from "@/stores/dragStore";
import { jsonToMetadata, metadataToJSON } from "@/utils/formatMetadata";
import { getStep } from "@/utils/step-utils";
import { formatDate } from "@/utils/to-datetime";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import type { ZodRawShape } from "zod";
import { useShallow } from "zustand/react/shallow";

export const FeaturePage = () => {
	const { getQueryParam, setQueryParam, compareQueryParam } = useQueryParam({
		name: "view",
	});
	const viewParam = getQueryParam();
	const { toast } = useToast();

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const {
		data: training,
		isSuccess,
		isPending: trainingPending,
	} = useGetTrainingById(decodeBase64(workflowId), decodeBase64(trainingId), {
		enabled: workflowId !== "" && trainingId !== "",
	});

	const { mutateAsync: updateTraining } = useUpdateTraining();
	const { mutateAsync: createFeature } = useCreateFeatureEx();
	const { mutateAsync: updateFeature } = useUpdateFeatureEx();

	const fields = useDragStore(useShallow((state) => state.fields));
	const onReset = useDragStore((state) => state.onReset);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const onSet = useDragStore((state) => state.onSet);
	const hasRunRef = useRef(false);

	useEffect(() => {
		if (isSuccess && training?.data.featureExtraction && !hasRunRef.current) {
			hasRunRef.current = true;
			const fieldObject = Object.entries(
				training?.data.featureExtraction?.data,
			);
			const featureNode = node(fields, onUpdateMetadata);
			onSet(
				fieldObject
					.map(([key, value]) => {
						const find = featureNode.find((v) => v.type === key);
						if (!find?.metadata) return undefined;
						return {
							...find,
							metadata: jsonToMetadata(find?.metadata, value),
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
				acc[field.type] = metadataToJSON(field.metadata, "array");
				return acc;
			},
			{} as Record<string, any>,
		);
		const preProcessFn = training?.data.featureExtraction
			? updateFeature
			: createFeature;
		await preProcessFn(
			{
				data: json,
				name: training?.data?.featureExtraction?.name
					? training?.data.featureExtraction.name
					: `${training?.data.workflow.name}-${formatDate()}`,
				id: training?.data.featureExtraction?.id || "",
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
							featureExtractionId: data.data.id,
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
								onReset();
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
		createFeature,
		updateFeature,
		fields,
		onReset,
		onSet,
		trainingId,
		updateTraining,
		workflowId,
		setQueryParam,
		toast,
		training?.data.pipeline,
		training?.data.featureExtraction,
		training?.data.workflow,
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
				<TableFeatureExSection />
			) : null}
			{compareQueryParam({ value: "blueprint" }) ? (
				<VisualFeatureExSection />
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
