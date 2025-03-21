import { Content, Subtle } from "@/components/typography/text";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/libs/utils";
import type { Metadata } from "@/stores/dragStore";
import { formatMetadata } from "@/utils/formatMetadata";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash } from "lucide-react";

type VisualCardProps = {
	id: string;
	title: string;
	metadata: Metadata;
	onEdit: () => void;
	onDelete: () => void;
};
export const VisualCard = ({
	id,
	title,
	metadata,
	onEdit,
	onDelete,
}: VisualCardProps) => {
	const { attributes, listeners, setNodeRef, transform } = useSortable({
		id,
	});
	const style = {
		transform: CSS.Transform.toString(transform),
	};
	return (
		<div
			key={`preprocessing-${id}`}
			className={cn(
				"flex relative space-x-8 border border-gray-200 group pb-4 pt-5 my-1 pl-3 hover:bg-zinc-50 duration-150",
				" active:border-zinc-300 shadow-xs rounded-lg",
			)}
			ref={setNodeRef}
			{...attributes}
			style={style}
		>
			<div className="w-6" {...listeners}>
				<TooltipProvider delayDuration={250}>
					<Tooltip>
						<TooltipContent className="z-99 bg-white">
							drag up-down to order context
						</TooltipContent>
						<TooltipTrigger asChild>
							<GripVertical />
						</TooltipTrigger>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className="-mt-1">
				<Content className="leading-tight">{title}</Content>
				<Subtle className="text-xs mt-0.5">{formatMetadata(metadata)}</Subtle>
			</div>
			<div className="absolute flex right-3 top-3">
				<Pencil
					className="w-6 h-6 p-1 hover:bg-zinc-200 rounded-lg duration-150"
					onClick={onEdit}
				/>
				<Trash
					className="w-6 h-6 p-1 text-red-500 hover:bg-red-200 rounded-lg duration-150"
					onClick={onDelete}
				/>
			</div>
		</div>
	);
};
