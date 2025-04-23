import { BaseSkeleton } from "@/components/specific/skeleton";
import {
	MultiStepLoaderController,
	type MultiStepLoaderRefHandle,
} from "@/components/specific/trainingLoader";
import { Content, PreDataBlock, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { presetList } from "@/configs/preset";
import { useDragStore } from "@/contexts/dragContext";
import {
	useStartTraining,
	useUpdateTraining,
} from "@/hooks/mutations/training-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { useRouter } from "@/libs/i18nNavigation";
import { getStep } from "@/utils/step-utils";
import type { AxiosError } from "axios";
import { Brain } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { formatCapital } from "../../../utils/capital";

export const ModelDetailsPage = () => {
	const { setQueryParam, getQueryParam } = useQueryParam({ name: "step" });
	const { toast } = useToast();
	const router = useRouter();
	const loaderRef = useRef<MultiStepLoaderRefHandle>(null);

	const startLoadingProcess = () => {
		loaderRef.current?.startLoading({ message: "Starting my custom process" });
	};

	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training, isPending: trainingPending } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);

	const { mutateAsync: updateTraining } = useUpdateTraining();

	const onSet = useDragStore((state) => state.onSet);

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
				onSuccess: (t, params) => {
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
		<div className="relative -pb-8">
			<MultiStepLoaderController
				ref={loaderRef}
				routeCallback={`/workflow/${decodeBase64(workflowId)}`}
				endpoint={`/workflows/${decodeBase64(workflowId)}/trainings/${decodeBase64(trainingId)}/start`}
			/>
			<BaseSkeleton loading={trainingPending}>
				{training &&
					Object.entries(training?.data).map(([key, value]) => (
						<div
							key={key}
							className="w-full flex gap-x-8 pt-6 pb-7 border-b border-gray-200"
						>
							<Subtle className=" w-1/4 font-medium text-zinc-500">
								{formatCapital(key)}
							</Subtle>

							{typeof value === "object" ? (
								value === null ? (
									<Subtle className="text-zinc-500">none</Subtle>
								) : (
									<PreDataBlock
										priority={
											value && "data" in value && "priority" in value.data
												? `${value.data.priority.length} process${value.data.priority.length > 1 ? "es" : ""}`
												: value && "name" in value
													? value.name
													: value && "steps" in value
														? `${value.steps.length} step${value.steps.length > 1 ? "s" : ""}`
														: null
										}
									>
										{JSON.stringify(value, null, 2)}
									</PreDataBlock>
								)
							) : (
								<Subtle className="text-zinc-500">{String(value)}</Subtle>
							)}
						</div>
					))}
			</BaseSkeleton>
			<div className="sticky pb-8 pt-4 bg-white bottom-0 flex justify-end w-full space-x-4 mt-6">
				<Button
					disabled={trainingPending}
					onClick={async () => await handlePrevious()}
					variant="ghost"
				>
					Previous
				</Button>
				<Button
					type="submit"
					effect="expandIcon"
					icon={Brain}
					iconPlacement="right"
					onClick={async () => startLoadingProcess()}
				>
					Start
				</Button>
			</div>
		</div>
	);
};
