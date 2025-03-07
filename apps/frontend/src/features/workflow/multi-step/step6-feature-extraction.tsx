import { Content } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { TableAugmentationSection } from "@/features/augmentation/section/table";
import { VisualAugmentationSection } from "@/features/augmentation/section/visual";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { cn } from "@/libs/utils";
import { getStep } from "@/utils/step-utils";
import { motion } from "framer-motion";
import { useCallback } from "react";

export const FeaturePage = () => {
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

	const handleSubmit = useCallback(() => {}, []);

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
