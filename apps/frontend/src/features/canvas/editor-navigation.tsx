import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { memo } from "react";

interface EditorNavigationProps {
	totalEditors: number;
	disabled?: [boolean, boolean];
	onPrevious: () => void;
	onNext: () => void;
	onSubmit: () => void;
}

export const EditorNavigation = ({
	disabled = [false, false],
	totalEditors,
	onPrevious,
	onSubmit,
	onNext,
}: EditorNavigationProps) => {
	return (
		<div className="flex flex-wrap items-center gap-4">
			<Button
				onClick={onSubmit}
				effect="expandIcon"
				iconPlacement="right"
				icon={Save}
			>
				Apply & Close
			</Button>
			<Button
				variant="outline"
				size="icon"
				onClick={onPrevious}
				disabled={disabled?.[0]}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				onClick={onNext}
				disabled={disabled?.[1]}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
};
