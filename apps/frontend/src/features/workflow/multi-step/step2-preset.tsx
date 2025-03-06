"use client";
import { Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { useDragStore } from "@/contexts/dragContext";
import { ListBox } from "@/features/image-preprocessing/components/listBox";
import { PresetBox } from "@/features/image-preprocessing/components/presetBox";
import { useCreateTraining } from "@/hooks/mutations/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { useToast } from "@/hooks/use-toast";
import { encodeBase64 } from "@/libs/base64";
import { decodeBase64 } from "@/libs/base64";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BrainCircuit, Ham, Layers } from "lucide-react";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const Step3Page = () => {
	const [selected, setSelected] = useState<"full" | "minimum" | "raw">();
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "id" });
	const { toast } = useToast();
	const workflowId = decodeBase64(getQueryParam()) || "";
	const { mutateAsync: createTraining, isPending: createPending } =
		useCreateTraining();
	const fields = useDragStore(useShallow((state) => state.fields));
	const onDrag = useDragStore((state) => state.onDrag);
	const onReset = useDragStore((state) => state.onReset);
	const onUpdate = useDragStore((state) => state.onUpdate);
	const onCheckAll = useDragStore((state) => state.onCheckAll);
	const onUnCheckAll = useDragStore((state) => state.onUnCheckAll);

	const handleChecked = useCallback(
		(id: string, check: boolean) => {
			onUpdate({
				id: id,
				metadata: { check: { type: "Boolean", value: check } },
			});
		},
		[onUpdate],
	);

	const handleSubmit = useCallback(async () => {
		const { current, steps } = fields.reduce(
			(acc, item, index) => {
				if (item.metadata.check.value === true) {
					acc.steps.push({ index, name: item.metadata.name.value as string });
					if (acc.current === null) {
						acc.current = item.metadata.name.value as string;
					}
				}
				return acc;
			},
			{
				current: null as string | null,
				steps: [] as { index: number; name: string }[],
			},
		);
		if (current === null) {
			return;
		}
		await createTraining(
			{
				workflowId,
				pipeline: {
					current,
					steps,
				},
			},
			{
				onSuccess: (ctx) => {
					onReset();
					setQueryParam({
						params: {
							step: encodeBase64("dataset"),
							id: encodeBase64(workflowId),
							trainings: encodeBase64(ctx?.data.id || ""),
						},
						resetParams: true,
					});
				},
				onError: (error) => {
					toast({ title: error.message, variant: "destructive" });
				},
			},
		);
	}, [setQueryParam, workflowId, onReset, fields, toast, createTraining]);

	const handlePrevious = useCallback(() => {
		setQueryParam({
			params: {
				step: encodeBase64("workflow_info"),
				id: encodeBase64(workflowId),
			},
			resetParams: true,
		});
	}, [setQueryParam, workflowId]);

	return (
		<>
			<div className=" max-w-screen-lg grid grid-cols-3 gap-x-5">
				<PresetBox
					current={fields.every((fields) => fields.metadata?.check?.value)}
					onClick={() => {
						setSelected("full");
						onCheckAll();
					}}
					title="Full Pipeline"
					description="Full customization pipeline"
					icon=<Layers />
				/>
				<PresetBox
					onClick={() => {
						setSelected("minimum");
					}}
					title="Minimum Pipeline"
					description="necessary process pipeline based on settings"
					icon=<BrainCircuit />
				/>
				<PresetBox
					current={fields.every((fields) => !fields.metadata?.check?.value)}
					onClick={() => {
						setSelected("raw");
						onUnCheckAll();
					}}
					title="Raw Pipeline"
					description="Set all train parameter to be default"
					icon=<Ham />
				/>
			</div>
			<Subtle className="mt-4">model pipeline</Subtle>
			<div>
				<DndContext collisionDetection={closestCenter} onDragEnd={onDrag}>
					<SortableContext
						items={fields.map((item) => ({ id: item.id }))}
						strategy={verticalListSortingStrategy}
					>
						{fields.map(
							({
								id,
								metadata,
								selectable,
								icon = <></>,
								description,
								...element
							}) => {
								return (
									<ListBox
										key={`pre-processing-${id}`}
										id={id}
										description={description || ""}
										icon={icon}
										{...element}
										check={metadata.check.value as boolean}
										onSelect={(value) => handleChecked(id, value)}
										selectable={true}
									/>
								);
							},
						)}
					</SortableContext>
				</DndContext>
			</div>
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button
					disabled={createPending}
					onClick={handlePrevious}
					variant="ghost"
				>
					Previous
				</Button>
				<Button
					disabled={createPending}
					onClick={async () => await handleSubmit()}
					type="submit"
				>
					Next
				</Button>
			</div>
		</>
	);
};
