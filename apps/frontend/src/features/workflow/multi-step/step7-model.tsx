import { BaseSkeleton } from "@/components/specific/skeleton";
import { Content, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { presetList } from "@/configs/preset";
import { useDragStore } from "@/contexts/dragContext";
import { ModelCard } from "@/features/model/components/card";
import {
	useCreateTraining,
	useUpdateTraining,
} from "@/hooks/mutations/training-api";
import { useGetEnum } from "@/hooks/queries/enum-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { encodeBase64 } from "@/libs/base64";
import { getArrayFromEnum } from "@/utils/array-from-enum";
import { getStep } from "@/utils/step-utils";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { modelKeyword } from "../../../configs/model";
import { decodeBase64 } from "../../../libs/base64";

export const ModelPage = () => {
	const [modelId, setModelId] = useState<string | null>(null);
	const { toast } = useToast();
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "id" });

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training, isPending: trainingPending } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);
	const { data: enumModel, isPending: enumModelPending } = useGetEnum();

	const { mutateAsync: updateTraining, isPending: updatePending } =
		useUpdateTraining();

	const enumModelByType = getArrayFromEnum(enumModel?.data, [
		"preTrainedModel",
		"deepLearning",
		training?.data.workflow.type,
	]);

	const onSet = useDragStore((state) => state.onSet);

	const handleSubmit = useCallback(async () => {
		if (!modelId) return;
		const modelJSON = enumModelByType?.includes(modelId)
			? { preTrainedModel: modelId }
			: { customModelId: modelId };

		await updateTraining(
			{
				workflowId: decodeBase64(workflowId),
				trainingId: decodeBase64(trainingId),
				...modelJSON,
			},
			{
				onSuccess: (t) => {
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
					toast({ title: error.message, variant: "destructive" });
				},
			},
		);
	}, [
		setQueryParam,
		modelId,
		onSet,
		training?.data,
		workflowId,
		trainingId,
		enumModelByType,
		toast,
		updateTraining,
	]);

	const handlePrevious = useCallback(() => {
		setQueryParam({
			params: {
				step: encodeBase64("preset"),
				id: workflowId as string,
			},
			resetParams: true,
		});
	}, [setQueryParam, workflowId]);

	return (
		<div className="flex flex-col gap-y-4">
			<Content>Pre-Trained Models</Content>
			<Subtle className="-mt-4">
				Ready-to-use popular{" "}
				<strong className="font-semibold">
					{training?.data.workflow.type.split("_").join(" ")}
				</strong>{" "}
				models pre-trained.
			</Subtle>
			<BaseSkeleton loading={enumModelPending}>
				<div className="w-[80vw] md:w-[70vw] overflow-x-auto">
					<div className="flex m-1 gap-x-4">
						{enumModelByType?.map((model) => {
							const { type, description, typeClass } = modelKeyword[model] ?? {
								type: "new",
								description: "new model that isn't implemented yet",
								typeClass: "text-zinc-500 bg-zinc-100",
							};
							return (
								<ModelCard
									key={model}
									title={model}
									type={type}
									typeClass={typeClass}
									description={description}
									className={modelId === model ? "border border-green-400" : ""}
									onClick={() => setModelId(model)}
									images={[]}
								/>
							);
						})}
					</div>
				</div>
			</BaseSkeleton>
			<Content>Custom Models</Content>
			<Subtle className="-mt-4">
				Build your own model tailored to your needs.
			</Subtle>
			<button
				type="button"
				className="w-64 h-48 hover:border-blue-700 hover:bg-zinc-50 hover:shadow-sm duration-150 active:scale-95 transition-transform border rounded-lg flex flex-col justify-center items-center"
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
