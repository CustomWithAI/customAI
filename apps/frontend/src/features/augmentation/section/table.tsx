"use client";
import {
	DialogBuilder,
	type DialogBuilderRef,
} from "@/components/builder/dialog";
import { AddFeatureSection } from "@/components/specific/add-feature";
import { EditFeature } from "@/components/specific/edit-feature";
import { Content, ContentHeader, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import EnhanceImage from "@/components/ui/enhanceImage";
import { node } from "@/configs/augmentation";
import { useDragStore } from "@/contexts/dragContext";
import { VisualCard } from "@/features/workflow/components/visual-card";
import { useGetImages } from "@/hooks/queries/dataset-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64 } from "@/libs/base64";
import { jsonToParams } from "@/utils/Json-to-params";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const TableAugmentationSection = () => {
	const [cursor, setCursor] = useState<string | null>(null);
	const [count, setCount] = useState<number>(1);
	const { getQueryParam } = useQueryParam();
	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
	);
	const { data: images } = useGetImages(
		training?.data.dataset?.id || "",
		{
			enabled: !!training?.data.dataset?.id,
		},
		jsonToParams({ limit: 1, cursor: cursor }),
	);

	const fields = useDragStore(useShallow((state) => state.fields));
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const onDrag = useDragStore((state) => state.onDrag);
	const onRemove = useDragStore((state) => state.onRemove);
	const editRef = useRef<DialogBuilderRef>(null);

	const input = useMemo(() => {
		return node(fields, onUpdateMetadata).filter((field) =>
			fields.map((field) => field.id).includes(field.id),
		);
	}, [fields, onUpdateMetadata]);

	return (
		<div className="grid grid-cols-4 gap-6 max-md:grid-cols-1">
			<div className="col-span-2 lg:col-span-3 max-md:order-2">
				<div className="min-h-[50vh]">
					<DndContext collisionDetection={closestCenter} onDragEnd={onDrag}>
						<SortableContext
							items={fields.map((item) => ({ id: item.id }))}
							strategy={verticalListSortingStrategy}
						>
							{fields.map(({ id, metadata, title }) => {
								return (
									<VisualCard
										key={`pre-processing-${id}`}
										id={id}
										title={title}
										metadata={metadata}
										onEdit={() => {
											editRef.current?.open();
											editRef.current?.setId(id);
										}}
										onDelete={() => {
											onRemove(id);
										}}
									/>
								);
							})}
						</SortableContext>
					</DndContext>
					<DialogBuilder
						config={{
							title: (
								<div className="flex space-x-3">
									<ImageIcon className="mt-1" />
									<div>
										<ContentHeader>Augmentation Options</ContentHeader>
										<Subtle>
											apply random data augmentation to those images
										</Subtle>
									</div>
								</div>
							),
							description: <div className="w-full border-b mt-4 mb-1" />,
							body: (
								<AddFeatureSection
									image={images?.data.at(0)?.url || ""}
									node={node}
								/>
							),
							trigger: (
								<Button
									variant="outline"
									className="mt-4 text-[#0063E8] border-[#0063E8] hover:text-[#004de8] active:scale-95 focus:scale-100 transition-transform duration-150 ease-in-out"
								>
									Add Data Augmentation
								</Button>
							),
						}}
					/>
				</div>
			</div>
			<DialogBuilder
				ref={editRef}
				config={{
					trigger: null,
					title: "Edit Image Processing",
					body: (id) => (
						<EditFeature
							image={images?.data.at(0)?.url || ""}
							id={id}
							node={node}
						/>
					),
				}}
			/>
			<div className="md:-mt-28 max-lg:col-span-2 max-md:flex">
				<div className="max-md:w-full">
					<Content>Original</Content>
					<div className="flex gap-x-3 max-md:mt-2 items-center">
						<button
							type="button"
							aria-disabled={!!images?.prevCursor}
							onClick={() => {
								if (images?.prevCursor) {
									setCount((prev) => prev - 1);
									setCursor(images?.prevCursor);
								}
							}}
							className="h-full items-center hover:bg-gray-200 rounded-lg"
						>
							<ChevronLeft className="aria-disabled:text-zinc-500 aria-disabled:cursor-not-allowed" />
						</button>
						<div className="relative flex items-center w-full md:m-6 aspect-square">
							<img
								src={images?.data.at(0)?.url || ""}
								alt="Description of the dataset"
								loading="lazy"
								className="object-cover rounded-lg shadow-lg"
							/>
						</div>
						<button
							type="button"
							aria-disabled={!!images?.nextCursor}
							onClick={() => {
								if (images?.nextCursor) {
									setCount((prev) => prev + 1);
									setCursor(images?.nextCursor);
								}
							}}
							className="h-full items-center hover:bg-gray-200 rounded-lg"
						>
							<ChevronRight className="aria-disabled:text-zinc-500 aria-disabled:cursor-not-allowed" />
						</button>
					</div>
					<p className="w-full max-md:mt-2 text-center text-sm text-gray-600">
						{count} of {images?.total}
					</p>
				</div>
				<div className="max-md:w-full">
					<Content>Preview</Content>
					<div className="flex gap-x-3 max-md:mt-2 items-center">
						<ChevronLeft className="text-transparent" />
						<div className="relative flex items-center w-full md:m-6 aspect-square">
							<EnhanceImage
								imagePath={images?.data.at(0)?.url || ""}
								filters={
									input
										.flatMap((fields) => fields.previewImg)
										.filter((f) => f !== undefined) || []
								}
								className="object-cover rounded-lg shadow-lg"
							/>
						</div>
						<ChevronRight className="text-transparent" />
					</div>
				</div>
			</div>
		</div>
	);
};
