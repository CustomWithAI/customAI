import { WindowList } from "@/components/layout/windowList";
import { BaseSkeleton } from "@/components/specific/skeleton";
import { Content, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { DatasetCard } from "@/features/dataset/components/gridBox";
import { useUpdateTraining } from "@/hooks/mutations/training-api";
import { useGetDatasets, useGetInfDatasets } from "@/hooks/queries/dataset-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { cn } from "@/libs/utils";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

export const DatasetPage = () => {
	const [datasetId, setDatasetId] = useState<string | null>(null);
	const { toast } = useToast();
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "id" });
	const { mutateAsync: updateTraining, isPending: updatePending } =
		useUpdateTraining();
	const datasetQuery = useGetInfDatasets();
	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

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
					setQueryParam({
						params: {
							step: encodeBase64(t?.data.pipeline.current || "start"),
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
	}, [setQueryParam, datasetId, workflowId, trainingId, toast, updateTraining]);

	const handlePrevious = useCallback(() => {
		setQueryParam({
			params: {
				step: encodeBase64("preset"),
				id: encodeBase64(workflowId as string),
			},
			resetParams: true,
		});
	}, [setQueryParam, workflowId]);

	return (
		<div className="flex flex-col gap-y-4">
			<Subtle>Recent dataset used</Subtle>
			<WindowList
				queryHook={datasetQuery}
				direction="horizontal"
				itemContent={(_, dataset) => (
					<DatasetCard
						key={dataset.id}
						title={dataset.name}
						description={dataset.description}
						imagesCount={dataset.imageCount}
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
				)}
			/>
			<Subtle>Create new dataset</Subtle>
			<button
				type="button"
				className="w-64 h-48 border-gray-200 hover:border-blue-700 hover:bg-zinc-50 hover:shadow-xs duration-150 active:scale-95 transition-transform border rounded-lg flex flex-col justify-center items-center"
			>
				<Plus className="mb-6" />
				<Content>Create a dataset</Content>
				<Subtle className="text-center">
					Start from uploading image to annotation
				</Subtle>
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
