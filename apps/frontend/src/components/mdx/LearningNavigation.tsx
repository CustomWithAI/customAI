import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LearningNavigationProps {
	prev?: {
		title: string;
		href: string;
	};
	next?: {
		title: string;
		href: string;
	};
}

export function LearningNavigation({ prev, next }: LearningNavigationProps) {
	return (
		<div className="flex flex-row items-center justify-between mt-12 border-t pt-4">
			{prev ? (
				<Link
					href={prev.href}
					className={cn(
						buttonVariants({ variant: "outline" }),
						"flex flex-row items-center gap-2",
					)}
				>
					<ChevronLeft className="h-4 w-4" />
					<div className="flex flex-col items-start">
						<span className="text-xs text-muted-foreground">Previous</span>
						<span>{prev.title}</span>
					</div>
				</Link>
			) : (
				<div />
			)}

			{next && (
				<Link
					href={next.href}
					className={cn(
						buttonVariants({ variant: "outline" }),
						"flex flex-row items-center gap-2 ml-auto",
					)}
				>
					<div className="flex flex-col items-end">
						<span className="text-xs text-muted-foreground">Next</span>
						<span>{next.title}</span>
					</div>
					<ChevronRight className="h-4 w-4" />
				</Link>
			)}
		</div>
	);
}
