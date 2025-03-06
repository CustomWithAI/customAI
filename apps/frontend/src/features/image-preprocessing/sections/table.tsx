import {
	DialogBuilder,
	type DialogBuilderRef,
} from "@/components/builder/dialog";
import { Content, ContentHeader, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import EnhanceImage from "@/components/ui/enhanceImage";
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
import { useCallback, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { AddFeatureSection } from "./add-feature";
import { EditFeature } from "./edit-feature";

export const TablePreprocessingSection = () => {
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
		jsonToParams({ limit: 1 }),
	);

	const fields = useDragStore(useShallow((state) => state.fields));
	const onDrag = useDragStore((state) => state.onDrag);
	const onRemove = useDragStore((state) => state.onRemove);
	const editRef = useRef<DialogBuilderRef>(null);

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
										<ContentHeader>Pre-processing Options</ContentHeader>
										<Subtle>
											apply pre-processing transformation to those images
										</Subtle>
									</div>
								</div>
							),
							description: <div className="w-full border-b my-4" />,
							body: <AddFeatureSection image={images?.data.at(0)?.url || ""} />,
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
						<EditFeature image={images?.data.at(0)?.url || ""} id={id} />
					),
				}}
			/>
			<div className="md:-mt-28 max-lg:col-span-2 max-md:flex">
				<div className="max-md:w-full">
					<Content>Original</Content>
					<div className="flex gap-x-3 max-md:mt-2 items-center">
						<div className="h-full items-center hover:bg-gray-200 rounded-lg">
							<ChevronLeft />
						</div>
						<div className="relative flex items-center w-full md:m-6 aspect-square">
							<img
								src={images?.data.at(0)?.url || ""}
								alt="Description of the dataset"
								loading="lazy"
								className="object-cover rounded-lg shadow-lg"
							/>
						</div>
						<div className="h-full items-center hover:bg-gray-200 rounded-lg">
							<ChevronRight />
						</div>
					</div>
					<p className="w-full max-md:mt-2 text-center text-sm text-gray-600">
						1 of {images?.total}
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
									fields
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
