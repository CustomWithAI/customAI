import { Combobox } from "@/components/specific/combobox";
import UploadZone from "@/components/specific/upload";
import UploadFile from "@/components/specific/uploadFile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetEnum } from "@/hooks/queries/enum-api";
import { useGetTrainingByWorkflowId } from "@/hooks/queries/training-api";
import { useGetWorkflows } from "@/hooks/queries/workflow-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useInferenceStore } from "@/stores/inferenceStore";
import { buildQueryParams } from "@/utils/build-param";
import { getImageSizeFromImageLike } from "@/utils/image-size";
import { toCapital } from "@/utils/toCapital";
import { useEffect, useId, useState } from "react";
import type { CanvasElement } from "../canvasGrid";

type SelectType = "manual" | "workflow" | "training";

export const ImageComponents = ({
	element,
	onChangeCallback,
	initialWidth,
	initialHeight,
}: {
	element: CanvasElement;
	onChangeCallback: (value: Partial<CanvasElement>) => void;
	initialWidth: number;
	initialHeight: number;
}) => {
	const id = useId();
	const { getQueryParam } = useQueryParam();
	const [workflowId, trainingId] = getQueryParam(["workflowId", "trainingId"]);

	const { data, filter, onSet, onClear, onSetFilter, onRemoveFilter } =
		useInferenceStore();

	const { data: enumType, isPending } = useGetEnum();
	const workflowQuery = useGetWorkflows(
		buildQueryParams({
			search: filter.workflow ? `name:${filter.workflow}` : undefined,
		}),
	);
	const trainingQuery = useGetTrainingByWorkflowId(
		workflowId || data.workflowId || "",
		buildQueryParams({
			search: filter.training ? `name:${filter.training}` : "",
		}),
		{ enabled: !!(workflowId || data.workflowId) },
	);

	const [selected, setSelected] = useState<SelectType>(
		trainingId ? "training" : workflowId ? "workflow" : "manual",
	);

	useEffect(() => {
		if (workflowId) {
			onSet("workflowId", workflowId);
		}
		if (trainingId) {
			onSet("trainingId", trainingId);
		}
	}, [workflowId, trainingId, onSet]);

	if (isPending) return null;

	return (
		<div className="flex bg-white gap-x-6">
			<div className="min-w-5/8 w-full max-w-[calc(100%-26rem)] aspect-[4/3] rounded bg-gray-50 shadow-2xs">
				<UploadZone
					onChange={async (file) => {
						if (!file?.[0]?.file) {
							onChangeCallback({
								width: initialWidth,
								height: initialHeight,
							});
							return;
						}
						onSet("image", file[0].file);
						const { width, height } = await getImageSizeFromImageLike(
							file[0].file,
						);
						console.log(
							(width + 36) * 1.625,
							width * 0.625 + 436,
							Math.min((width + 36) * 1.625, width * 0.625 + 436),
						);
						onChangeCallback({
							width: Math.max(
								initialWidth,
								Math.min((width + 36) * 1.625, width * 0.625 + 436),
							),
							height: Math.max(initialHeight, height + 84),
						});
					}}
				/>
			</div>
			<div className="flex-1 w-3/8 pt-6 max-w-96 space-y-4 pr-6">
				<>
					<Label className="mb-1 pb-1 text-xs" htmlFor={`${id}-model`}>
						method
					</Label>
					<Select
						value={selected}
						onValueChange={(value) => setSelected(value as SelectType)}
					>
						<SelectTrigger id={`${id}-model`} className="w-48">
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent className="z-[500]">
							<SelectItem value="manual">use manual model</SelectItem>
							<SelectItem value="workflow">
								use default model in workflow
							</SelectItem>
							<SelectItem value="training">use model in training</SelectItem>
						</SelectContent>
					</Select>
				</>
				<div className="border-b border-gray-200 mt-0.5" />
				{selected === "manual" ? (
					<>
						<Label className="mb-1 pb-1 text-xs">model path</Label>
						<UploadFile onChange={(file) => {}} />
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label htmlFor={`${id}-class`} className="mb-1 pb-1 text-xs">
									model class type
								</Label>
								<Select
									value={data.workflow}
									onValueChange={(value) => onSet("workflow", value)}
								>
									<SelectTrigger id={`${id}-class`} className="w-full">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent className="z-[500]">
										{(enumType?.data?.inferenceWorkflow as string[]).map(
											(workflow) => (
												<SelectItem key={workflow} value={workflow}>
													{toCapital(workflow)}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label className="mb-1 pb-1 text-xs">model type</Label>
								<Select
									value={data.training}
									onValueChange={(value) => onSet("training", value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent className="z-[500]">
										{(enumType?.data?.inferenceTraining as string[]).map(
											(workflow) => (
												<SelectItem key={workflow} value={workflow}>
													{toCapital(workflow)}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label className="mb-1 pb-1 text-xs">model version</Label>
								<Select
									value={data.version}
									onValueChange={(value) => onSet("version", value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent className="z-[500]">
										{(enumType?.data?.inferenceVersion as string[]).map(
											(workflow) => (
												<SelectItem key={workflow} value={workflow}>
													{toCapital(workflow)}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</div>
						</div>
					</>
				) : null}
				{selected === "workflow" ? (
					<>
						<Label htmlFor={`${id}-workflow`} className="mb-1 pb-1 text-xs">
							workflow
						</Label>
						<Combobox
							hook={workflowQuery}
							id={`${id}-workflow`}
							keyExtractor={(workflow) => String(workflow.id)}
							itemContent={(workflow) => (
								<div className="flex flex-col">
									<span>{workflow.name}</span>
									<span className="text-xs text-muted-foreground">
										{workflow.type}
									</span>
								</div>
							)}
							filter={(f) => onSetFilter("workflow", f)}
							value={data.workflowId}
							popoverClassName="z-[999]"
							onChange={(v) => onSet("workflowId", v)}
							placeholder="Search workflow..."
							emptyMessage="No workflow found"
						/>
					</>
				) : null}
				{selected === "training" ? (
					<>
						<Label htmlFor={`${id}-workflowId`} className="mb-1 pb-1 text-xs">
							workflow
						</Label>
						<Combobox
							hook={workflowQuery}
							keyExtractor={(workflow) => String(workflow.id)}
							itemContent={(workflow) => (
								<div className="flex flex-col">
									<span>{workflow.name}</span>
									<span className="text-xs text-muted-foreground">
										{workflow.type}
									</span>
								</div>
							)}
							id={`${id}-workflowId`}
							filter={(f) => onSetFilter("workflow", f)}
							value={data.workflowId}
							popoverClassName="z-[999]"
							onChange={(v) => onSet("workflowId", v)}
							placeholder="Search workflow by name..."
							emptyMessage="No workflow found"
						/>
						<Label htmlFor={`${id}-trainingId`} className="mb-1 pb-1 text-xs">
							training
						</Label>
						<Combobox
							hook={trainingQuery}
							disabled={!(workflowId || data.workflowId)}
							keyExtractor={(training) => String(training.id)}
							itemContent={(training) => (
								<div className="flex flex-col">
									<span>{training.version}</span>
									<span className="text-xs text-muted-foreground">
										{training.status}
									</span>
								</div>
							)}
							id={`${id}-trainingId`}
							filter={(f) => onSetFilter("training", f)}
							value={data.trainingId}
							popoverClassName="z-[999]"
							onChange={(v) => onSet("trainingId", v)}
							placeholder="Search training by name..."
							emptyMessage="No training found"
						/>
					</>
				) : null}
				<Button effect="ripple">start</Button>
			</div>
		</div>
	);
};
