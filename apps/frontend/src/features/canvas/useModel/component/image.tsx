import { Combobox } from "@/components/specific/combobox";
import UploadZone from "@/components/specific/upload";
import UploadFile from "@/components/specific/uploadFile";
import { Content } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGetInference } from "@/hooks/mutations/inference-api";
import { useGetEnum } from "@/hooks/queries/enum-api";
import {
	useCreateCustomInference,
	useCreateTrainingInference,
	useCreateWorkflowInference,
} from "@/hooks/queries/inference-api";
import { useGetTrainingByWorkflowId } from "@/hooks/queries/training-api";
import { useGetWorkflows } from "@/hooks/queries/workflow-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/libs/utils";
import { useInferenceStore } from "@/stores/inferenceStore";
import type {
	ArrayAnnotation,
	ClassifiedLabel,
	InferenceResponse,
	Polygon,
	Square,
	SquareWithConfident,
} from "@/types/response/inference";
import type { Point } from "@/types/square";
import { buildQueryParams } from "@/utils/build-param";
import { darkenColor } from "@/utils/color-utils";
import { getImageSizeFromImageLike } from "@/utils/image-size";
import { generateRandomLabel } from "@/utils/random";
import { toCapital } from "@/utils/toCapital";
import { Loader2, RotateCcw } from "lucide-react";
import { useFormatter } from "next-intl";
import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { CanvasElement } from "../canvasGrid";

type SelectType = "manual" | "workflow" | "training";

function isSquare(a: ArrayAnnotation[number]): a is Square {
	return (
		typeof a === "object" &&
		a !== null &&
		"x" in a &&
		"y" in a &&
		"width" in a &&
		"height" in a &&
		"label" in a &&
		!("confidence" in a) &&
		!("points" in a)
	);
}

function isSquareWithConfidence(
	a: ArrayAnnotation[number],
): a is SquareWithConfident {
	return (
		typeof a === "object" &&
		a !== null &&
		"x" in a &&
		"y" in a &&
		"width" in a &&
		"height" in a &&
		"label" in a &&
		"confidence" in a &&
		!("points" in a)
	);
}

function isPolygon(a: ArrayAnnotation[number]): a is Polygon {
	return (
		typeof a === "object" &&
		a !== null &&
		"points" in a &&
		Array.isArray(a.points)
	);
}

function isClassifiedLabel(
	a: InferenceResponse["annotation"],
): a is ClassifiedLabel {
	return (
		a &&
		typeof a === "object" &&
		a !== null &&
		"label" in a &&
		!("x" in a) &&
		!("points" in a)
	);
}

const COLOR_STATUS: Record<string, "red" | "amber" | "green" | "blue"> = {
	pending: "blue",
	running: "amber",
	completed: "green",
	failed: "red",
};

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
	const { relativeTime } = useFormatter();
	const [workflowId, trainingId] = getQueryParam(["workflowId", "trainingId"]);

	const { data, filter, onSet, onClear, onSetFilter, onRemoveFilter } =
		useInferenceStore();

	const {
		data: inference,
		status,
		refetch: inferenceRefetch,
		fetchStatus,
	} = useGetInference({
		id: String(element.inferenceId),
		options: {
			enabled: !!element.inferenceId,
		},
	});

	const [showAnnotation, setShowAnnotation] = useState(true);

	const overlayRef = useRef<HTMLDivElement>(null);
	const [imageRender, setImageRender] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	}>({ x: 1, y: 1, width: 0, height: 0 });
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (!inference?.imagePath) return;
		const updateOverlay = () => {
			const img = imageRef.current;
			const overlay = overlayRef.current;
			if (!img || !overlay) return;
			const renderedWidth = img.offsetWidth;
			const renderedHeight = img.offsetHeight;
			const naturalWidth = img.naturalWidth;
			const naturalHeight = img.naturalHeight;

			overlay.style.width = `${img.offsetWidth}px`;
			overlay.style.height = `${img.offsetHeight}px`;
			overlay.style.top = `${img.offsetTop}px`;
			overlay.style.left = `${img.offsetLeft}px`;

			setImageRender({
				x: renderedWidth / naturalWidth,
				y: renderedHeight / naturalHeight,
				width: renderedWidth,
				height: renderedHeight,
			});
		};

		const img = imageRef.current;
		if (!img) return;

		if (img.complete) {
			updateOverlay();
		}

		const handleLoad = () => updateOverlay();
		const handleResize = () => updateOverlay();

		img.addEventListener("load", handleLoad);
		window.addEventListener("resize", handleResize);

		const timeoutId = setTimeout(updateOverlay, 100);

		return () => {
			img.removeEventListener("load", handleLoad);
			window.removeEventListener("resize", handleResize);
			clearTimeout(timeoutId);
		};
	}, [inference?.imagePath]);

	const { data: enumType, isPending } = useGetEnum();

	const workflowQuery = useGetWorkflows(
		buildQueryParams({
			search: filter.workflow ? `name:${filter.workflow}` : undefined,
		}),
	);

	const { mutateAsync: createCustomInference, isPending: customPending } =
		useCreateCustomInference();
	const { mutateAsync: createWorkflowInference, isPending: workflowPending } =
		useCreateWorkflowInference();
	const { mutateAsync: createTrainingInference, isPending: trainingPending } =
		useCreateTrainingInference();

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

	const handleOnSuccessStart = useCallback(
		(data: InferenceResponse | undefined) => {
			if (data?.id) {
				onChangeCallback({ inferenceId: data.id });
				toast({ title: "image is on process at server, please wait :)" });
			}
		},
		[onChangeCallback],
	);

	const handleStart = useCallback(async () => {
		if (inference?.id) return;

		switch (selected) {
			case "manual": {
				if (!data.image || !data.model || !data.workflow || !data.training) {
					break;
				}
				const customFormData = new FormData();
				customFormData.append("image", data.image as File);
				customFormData.append(
					"config",
					JSON.stringify({
						workflow: data.workflow,
						training: data.training,
						version: data.version,
					}),
				);
				customFormData.append("model", data.model as File);
				await createCustomInference(
					{ data: customFormData },
					{ onSuccess: (data) => handleOnSuccessStart(data?.data) },
				);
				break;
			}
			case "workflow": {
				if (!data.image || !data.workflowId) return;
				const workflowFormData = new FormData();
				workflowFormData.append("image", data.image as File);
				await createWorkflowInference(
					{ workflowId: data.workflowId, data: workflowFormData },
					{ onSuccess: (data) => handleOnSuccessStart(data?.data) },
				);
				break;
			}
			case "training": {
				if (!data.image || !data.workflowId || !data.trainingId) return;
				const trainingFormData = new FormData();
				trainingFormData.append("image", data.image as File);
				await createTrainingInference(
					{
						workflowId: data.workflowId,
						trainingId: data.trainingId,
						data: trainingFormData,
					},
					{ onSuccess: (data) => handleOnSuccessStart(data?.data) },
				);
				break;
			}
		}
	}, [
		createCustomInference,
		createTrainingInference,
		createWorkflowInference,
		data,
		handleOnSuccessStart,
		inference,
		selected,
	]);

	useEffect(() => {
		if (workflowId) {
			onSet("workflowId", workflowId);
		}
		if (trainingId) {
			onSet("trainingId", trainingId);
		}
	}, [workflowId, trainingId, onSet]);

	const renderedAnnotation = useMemo(() => {
		if (!Array.isArray(inference?.annotation)) return null;
		return inference.annotation.map((ann, index) => {
			const { color } = generateRandomLabel();
			if (isSquare(ann) || isSquareWithConfidence(ann)) {
				let correctedWidth = ann.width;
				let correctedHeight = ann.height;
				let correctedLeft = ann.x;
				let correctedTop = ann.y;

				if (correctedWidth < 0) {
					correctedWidth = Math.abs(correctedWidth);
					correctedLeft = ann.x + correctedWidth;
				}

				if (correctedHeight < 0) {
					correctedHeight = Math.abs(correctedHeight);
					correctedTop = ann.y + correctedHeight;
				}

				if (correctedLeft < 0) {
					correctedLeft = Math.abs(correctedLeft);
				}

				if (correctedTop < 0) {
					correctedTop = Math.abs(correctedTop);
				}
				return (
					<div
						key={`square-${index}`}
						className={cn(
							"absolute border-2 border-dashed hover:border-solid rounded-md bg-opacity-65 duration-150",
						)}
						style={{
							left: correctedLeft * imageRender?.x,
							top: correctedTop * imageRender?.y,
							width: correctedWidth * imageRender?.x,
							height: correctedHeight * imageRender?.y,
							zIndex: (ann as any).zIndex || 1,
							backgroundColor: `${color}30`,
							borderColor: darkenColor(color, 20),
						}}
					>
						<Badge
							variant="secondary"
							className="absolute -translate-y-full -top-1 left-0 text-white text-xs font-medium"
							style={{
								backgroundColor: `${color}90`,
							}}
						>
							{ann.label}
							{isSquareWithConfidence(ann) &&
								` (${(ann.confidence * 100).toFixed(1)}%)`}
						</Badge>
					</div>
				);
			}

			if (isPolygon(ann)) {
				const { color } = generateRandomLabel();
				const createPathFromPoints = (points: Point[]) => {
					if (points.length === 0) return "";
					return `M ${points[0].x * imageRender.x} ${points[0].y * imageRender.y} ${points
						.slice(1)
						.map((p) => `L ${p.x * imageRender.x} ${p.y * imageRender.y}`)
						.join(" ")}`;
				};

				return (
					<svg
						className="absolute inset-0"
						width="100%"
						height="100%"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
						}}
					>
						<g key={`${ann.label}-path`}>
							<path
								d={`${createPathFromPoints(ann.points)} Z`}
								fill={`${color}40`}
								stroke={color}
								strokeWidth={2}
								strokeDasharray={3}
							/>
							<foreignObject
								x={Math.max(
									0,
									Math.min(
										imageRender?.width || 0,
										ann.points[0].x * imageRender.x + 8,
									),
								)}
								y={Math.max(
									0,
									Math.min(
										imageRender?.height || 0,
										ann.points[0].y * imageRender.y - 24,
									),
								)}
								width={(ann?.label?.length || 0) * 7.4 + 24}
								height="30"
							>
								<Badge
									variant="secondary"
									className="text-xs font-medium"
									style={{
										backgroundColor: `${color}30`,
									}}
								>
									{ann?.label}
								</Badge>
							</foreignObject>
						</g>
					</svg>
				);
			}

			return null;
		});
	}, [inference?.annotation, imageRender]);

	if (isPending) return null;
	if (fetchStatus === "fetching")
		return (
			<div className="flex justify-center items-center w-full h-full">
				<Loader2 className="size-7 animate-spin" />
			</div>
		);
	if (status === "success" && inference?.id)
		return (
			<div className="flex bg-white gap-x-6">
				<div className="min-w-5/8 w-full max-w-[calc(100%-26rem)] aspect-[4/3] rounded bg-gray-50 shadow-2xs">
					<div className="border-input relative flex min-h-52 h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors">
						<div className="absolute inset-0 flex items-center justify-center p-4">
							<img
								src={inference.imagePath}
								ref={imageRef}
								alt="Uploaded"
								className="mx-auto select-none max-h-full rounded object-contain"
							/>
							<div className="absolute pointer-events-none" ref={overlayRef}>
								{showAnnotation && renderedAnnotation}
							</div>
						</div>
					</div>
				</div>
				<div className="flex-1 flex flex-col justify-between w-3/8 py-6 max-w-96 pr-6">
					<div>
						<Label className="mb-1 pb-1 text-xs" htmlFor={`${id}-status`}>
							status
						</Label>
						<Badge
							variant="secondary"
							effect="softBorder"
							size="lg"
							color={COLOR_STATUS[inference.status] ?? "new"}
						>
							{inference.status}
						</Badge>
						{isClassifiedLabel(inference.annotation) ? (
							<>
								<Label className="mt-5 pb-1 text-xs" htmlFor={`${id}-label`}>
									classification label
								</Label>
								<Badge variant="outline" className="text-xs font-medium">
									{inference.annotation.label}
								</Badge>
							</>
						) : (
							<>
								<Label className="mt-5 pb-1 text-xs" htmlFor={`${id}-show`}>
									show annotation
								</Label>
								<Switch
									checked={showAnnotation}
									onCheckedChange={setShowAnnotation}
								/>
							</>
						)}
					</div>
					<div className="flex gap-x-4">
						<Content className="text-xs text-muted-foreground">
							last updated: {relativeTime(new Date(inference.updatedAt))}
						</Content>
						<button
							type="button"
							onClick={() => inferenceRefetch()}
							className="px-2 pt-0.5 hover:bg-gray-50 active:bg-gray-100 pb-0.5 group"
						>
							<RotateCcw className="size-3 group-hover:rotate-180 group-active:rotate-0 group-hover:underline duration-200 ease-in-out" />
						</button>
					</div>
				</div>
			</div>
		);
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
						<UploadFile
							onChange={(file) => {
								if (!file?.[0]?.file) return;
								onSet("model", file[0].file);
							}}
						/>
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
							itemDisplay={(workflow) => workflow.name}
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
							itemDisplay={(workflow) => workflow.name}
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
							itemDisplay={(training) => training.version}
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
				<Button
					disabled={customPending || workflowPending || trainingPending}
					onClick={() => handleStart()}
					effect="ripple"
				>
					start
				</Button>
			</div>
		</div>
	);
};
