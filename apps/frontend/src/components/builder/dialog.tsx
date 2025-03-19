import { cn } from "@/libs/utils";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	forwardRef,
	useImperativeHandle,
	useState,
} from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

type DialogBuilderProps = {
	config: {
		trigger: ReactNode | null;
		className?: string;
		title: ReactNode;
		description?: ReactNode;
		body?: ReactNode | ((id: string) => ReactNode);
		footer?: ReactNode;
	};
};

export type DialogBuilderRef = {
	open: () => void;
	close: () => void;
	setId: (id: string) => void;
};

export const DialogBuilder = forwardRef<DialogBuilderRef, DialogBuilderProps>(
	(
		{ config: { trigger, title, description, footer, className, body } },
		ref,
	) => {
		const [isOpen, setIsOpen] = useState(false);
		const [id, setId] = useState<string | null>(null);
		useImperativeHandle(ref, () => ({
			open: () => setIsOpen(true),
			close: () => setIsOpen(false),
			setId: (id) => setId(id),
		}));

		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
				<DialogContent
					className={cn(
						"w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-white",
						className,
					)}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
					</DialogHeader>
					<div
						className={cn(
							"flex-1 relative overflow-auto min-h-0 h-full max-h-[70vh]",
							{
								"max-h-[80vh]": description,
							},
						)}
					>
						{typeof body === "function" ? (id ? body(id) : undefined) : body}
					</div>
					{footer && <DialogFooter>{footer}</DialogFooter>}
				</DialogContent>
			</Dialog>
		);
	},
);
