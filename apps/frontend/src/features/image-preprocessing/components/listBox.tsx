import { Content, Subtle } from "@/components/typography/text";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/libs/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { type ReactElement, type ReactNode, cloneElement, memo } from "react";

type ListBoxProps = {
	id: string;
	title: string;
	description: string;
	icon: ReactNode;
	selectable?: boolean;
	check: boolean;
	onSelect: (value: boolean) => void;
	draggable?: boolean;
	editable?: boolean;
};

export const ListBox = memo(
	({
		id,
		title,
		description,
		icon,
		check,
		onSelect,
		selectable,
	}: ListBoxProps) => {
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
					"flex space-x-8 group pb-4 pt-5 my-0.5 pl-3 hover:bg-zinc-50 duration-150 active:border-zinc-300 rounded-lg",
				)}
				ref={setNodeRef}
				{...attributes}
				style={style}
			>
				<div className="w-6" {...listeners}>
					<TooltipProvider delayDuration={250}>
						<Tooltip>
							<TooltipContent className="z-[99] bg-white">
								drag up-down to order a process
							</TooltipContent>
							<TooltipTrigger asChild>
								<GripVertical className="group-hover:flex hidden" />
							</TooltipTrigger>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div className="px-4">
					<Checkbox
						disabled={!selectable}
						checked={check}
						className="z-50 mt-[3px]"
						onCheckedChange={(e) => onSelect(e as boolean)}
					/>
				</div>
				{cloneElement(icon as ReactElement, {
					className: cn("h-6 w-6 text-black/60"),
				})}
				<div className="-mt-1">
					<Content className="leading-tight">{title}</Content>
					<Subtle className="text-xs">{description}</Subtle>
				</div>
			</div>
		);
	},
);
