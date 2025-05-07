import { WindowList } from "@/components/layout/windowList";
import { BaseSkeleton } from "@/components/specific/skeleton";
import { Content, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/configs/step-key";
import { DatasetCard } from "@/features/dataset/components/gridBox";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import {
	useGetDataset,
	useGetDatasets,
	useGetInfDatasets,
} from "@/hooks/queries/dataset-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useFlowNavigation, useStartFlow } from "@/hooks/use-flow-navigation";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { cn } from "@/libs/utils";
import { Plus, X } from "lucide-react";
import { useCallback, useState } from "react";

export const DatasetPage = () => {
	const { toast } = useToast();
	const { getFlowData, clearFlowData } = useFlowNavigation();
	const startFlow = useStartFlow();
	const [datasetId, setDatasetId] = useState<string | null>(
		getFlowData()?.id || null,
	);
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "id" });

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);
	const { data: training, isSuccess } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);
	const { mutateAsync: updateTraining, isPending: updatePending } =
		useUpdateTraining();
	const datasetQuery = useGetInfDatasets({
		params: {
			filter: training?.data?.workflow?.type
				? `annotationMethod:${training?.data?.workflow?.type}`
				: null,
		},
		config: {
			enabled: !!training?.data?.workflow?.type,
		},
	});

	const { data: dataset, isPending: loadDataset } = useGetDataset(
		getFlowData()?.id,
		{ enabled: !!getFlowData()?.id },
	);

	const handleSubmit = useCallback(async () => {
		if (!datasetId) {
			return;
		}
		await updateTraining(
			{
				workflowId: decodeBase64(workflowId),
				trainingId: decodeBase64(trainingId),
				datasetId,
			},
			{
				onSuccess: (t) => {
					clearFlowData();
					setQueryParam({
						params: {
							step: encodeBase64(
								t?.data.pipeline?.steps?.find((s) => s.index === 0)?.name ||
									STEPS.Finish,
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
		datasetId,
		clearFlowData,
		workflowId,
		trainingId,
		toast,
		updateTraining,
	]);

	const handlePrevious = useCallback(() => {
		setQueryParam({
			params: {
				step: encodeBase64("preset"),
				id: workflowId,
			},
			resetParams: true,
		});
	}, [setQueryParam, workflowId]);

	return (
		<div className="flex flex-col gap-y-4">
			<Subtle>Recent dataset used</Subtle>
			<WindowList
				query={datasetQuery}
				direction="horizontal"
				className="h-64 overflow-y-hidden"
				itemContent={(_, dataset) => (
					<div key={dataset.id}>
						<DatasetCard
							title={dataset.name}
							description={dataset.description}
							imagesCount={dataset.imageCount}
							splitMethod={dataset.splitMethod}
							selectMode
							href={""}
							className={cn(
								datasetId === dataset.id
									? "border-green-400"
									: "border-transparent",
								"mr-4 border",
							)}
							onClick={() => setDatasetId(dataset.id)}
							images={dataset.images}
						/>
					</div>
				)}
			/>
			<Subtle>Create new dataset</Subtle>
			<button
				type="button"
				onClick={() => {
					if (getFlowData()?.id) {
						clearFlowData();
					}
					startFlow("/dataset/create", {
						flowTitle: "Create Dataset Workflow",
						returnPath: "auto",
					});
				}}
				className={cn(
					"w-64 h-48 border-gray-200 relative hover:border-blue-700 hover:bg-zinc-50 hover:shadow-xs duration-150 active:scale-95 transition-transform border rounded-lg flex flex-col justify-center items-center",
					{ "border-green-400": getFlowData()?.id && !loadDataset },
				)}
			>
				{getFlowData()?.id && !loadDataset ? null : <Plus className="mb-6" />}
				<Content>
					{getFlowData()?.id && !loadDataset
						? dataset?.name
						: "Create a dataset"}
				</Content>
				<Subtle className="text-center">
					{getFlowData()?.id && !loadDataset
						? `${dataset?.imageCount} image${(dataset?.imageCount || 0) > 1 ? "s" : ""}`
						: "Start from uploading image to annotation"}
				</Subtle>
				{getFlowData()?.id && !loadDataset && (
					<div
						onKeyDown={() => clearFlowData()}
						onClick={() => clearFlowData()}
						className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100"
					>
						<X className="size-4" />
					</div>
				)}
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
