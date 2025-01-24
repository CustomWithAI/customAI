"use client";
import { Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { useDragStore } from "@/contexts/dragContext";
import { ListBox } from "@/features/image-preprocessing/components/listBox";
import { PresetBox } from "@/features/image-preprocessing/components/presetBox";
import { useQueryParam } from "@/hooks/use-query-params";
import { encodeBase64 } from "@/libs/base64";
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
	const { setQueryParam } = useQueryParam({ name: "step" });
	const fields = useDragStore(useShallow((state) => state.fields));
	const onDrag = useDragStore((state) => state.onDrag);
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

	const handleSubmit = useCallback(() => {
		setQueryParam({ value: encodeBase64("preprocessing"), resetParams: true });
	}, [setQueryParam]);

	return (
		<>
			<div className=" max-w-screen-lg grid grid-cols-3 gap-x-5">
				<PresetBox
					current={fields.every((fields) => fields.metadata.check.value)}
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
					current={fields.every((fields) => !fields.metadata.check.value)}
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
				<Button variant="ghost">Previous</Button>
				<Button onClick={handleSubmit} type="submit">
					Next
				</Button>
			</div>
		</>
	);
};
