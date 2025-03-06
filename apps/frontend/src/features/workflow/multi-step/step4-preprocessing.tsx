import { Content } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { TablePreprocessingSection } from "@/features/image-preprocessing/sections/table";
import { VisualPreprocessingSection } from "@/features/image-preprocessing/sections/visual";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { useRouterAsync } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import { getStep } from "@/utils/step-utils";
import { motion } from "framer-motion";
import { useCallback } from "react";

export const ImagePreprocessingPage = () => {
	const { getQueryParam, setQueryParam, compareQueryParam } = useQueryParam({
		name: "view",
	});
	const viewParam = getQueryParam();

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training } = useGetTrainingById(workflowId, trainingId);

	const handleSubmit = useCallback(() => {
		setQueryParam({
			params: {
				step: encodeBase64(
					getStep(
						"next",
						training?.data.pipeline.current,
						training?.data.pipeline.steps,
					),
				),
				id: workflowId,
				trainings: trainingId,
			},
			resetParams: true,
		});
	}, [setQueryParam, trainingId, workflowId, training?.data.pipeline]);

	const handlePrevious = useCallback(() => {
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
	}, [setQueryParam, workflowId, trainingId, training?.data.pipeline]);
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
				<Button onClick={handleSubmit} type="submit">
					Next
				</Button>
			</div>
		</>
	);
};
