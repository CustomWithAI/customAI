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
import { node } from "@/configs/image-preprocessing";
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
import { TableCard } from "../components/table-card";

export const TableModelSection = () => {
	const [cursor, setCursor] = useState<string | null>(null);
	const { getQueryParam } = useQueryParam();
	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

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
									<TableCard
										key={`model-${id}`}
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
										<ContentHeader>Pre-processing Options</ContentHeader>
										<Subtle>
											apply pre-processing transformation to those images
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
									Add Image Preprocessing
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
		</div>
	);
};
