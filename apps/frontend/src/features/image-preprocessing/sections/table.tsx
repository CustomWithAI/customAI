import { Content } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { useDragStore } from "@/contexts/dragContext";
import { VisualCard } from "@/features/workflow/components/visual-card";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

export const TablePreprocessingSection = () => {
	const fields = useDragStore(useShallow((state) => state.fields));
	const onDrag = useDragStore((state) => state.onDrag);

	const handleSubmit = useCallback(() => {}, []);
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
										onEdit={() => {}}
										onDelete={() => {}}
									/>
								);
							})}
						</SortableContext>
					</DndContext>
					<Button
						variant="outline"
						className="mt-4 text-[#0063E8] border-[#0063E8] hover:text-[#004de8] active:scale-95 focus:scale-100 transition-transform duration-150 ease-in-out"
					>
						Add Image Preprocessing
					</Button>
				</div>
				<div className="flex justify-end w-full space-x-4 mt-6">
					<Button variant="ghost">Previous</Button>
					<Button onClick={handleSubmit} type="submit">
						Next
					</Button>
				</div>
			</div>
			<div className="md:-mt-28 max-lg:col-span-2 max-md:flex">
				<div className="max-md:w-full">
					<Content>Original</Content>
					<div className="flex gap-x-3 max-md:mt-2 items-center">
						<ChevronLeft />
						<div className="relative w-full md:m-6 aspect-square">
							<Image
								src="/images/image.png"
								alt="Description of the image"
								fill
								className="object-cover rounded-lg shadow-lg"
								priority
							/>
						</div>
						<ChevronRight />
					</div>
					<p className="w-full max-md:mt-2 text-center text-sm text-gray-600">
						1 of 13
					</p>
				</div>
				<div className="max-md:w-full">
					<Content>Preview</Content>
					<div className="flex gap-x-3 max-md:mt-2 items-center">
						<ChevronLeft className="text-transparent" />
						<div className="relative w-full md:m-6 aspect-square">
							<Image
								src="/images/image.png"
								alt="Description of the image"
								fill
								className="object-cover rounded-lg shadow-lg"
								priority
							/>
						</div>
						<ChevronRight className="text-transparent" />
					</div>
				</div>
			</div>
		</div>
	);
};
