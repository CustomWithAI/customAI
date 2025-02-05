import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";

interface EditorNavigationProps {
	currentIndex: number;
	totalEditors: number;
	onPrevious: () => void;
	onNext: () => void;
}

export const EditorNavigation = ({
	currentIndex,
	totalEditors,
	onPrevious,
	onNext,
}: EditorNavigationProps) => {
	return (
		<div className="flex items-center gap-4">
			<Button
				variant="outline"
				size="icon"
				onClick={onPrevious}
				disabled={currentIndex === 0}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<span className="text-sm">
				Editor {currentIndex + 1} of {totalEditors}
			</span>
			<Button
				variant="outline"
				size="icon"
				onClick={onNext}
				disabled={currentIndex === totalEditors - 1}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
};
