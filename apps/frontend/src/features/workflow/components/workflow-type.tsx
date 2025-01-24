import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, FilterX } from "lucide-react";
import { type ElementRef, useRef, useState } from "react";
import { WorkflowCard } from "./workflow-card";

type WorkflowTypeSectionProps = {
	value: string;
	onChange: (value: string) => void;
};
export const WorkflowTypeSection = ({
	value,
	onChange,
}: WorkflowTypeSectionProps) => {
	const [input, setInput] = useState<string | undefined>("");
	const inputRef = useRef<ElementRef<"input">>(null);
	return (
		<div className="space-y-2">
			<FormLabel>Workflow Pipeline Type</FormLabel>
			<div className="relative flex max-w-64">
				<Input
					ref={inputRef}
					value={input}
					placeholder="filter by tags.."
					onChange={(event) => setInput(event.target.value)}
					type="text"
					className="pr-7"
				/>
				<button
					type="button"
					onClick={() => {
						if (value || value !== "") {
							setInput("");
							inputRef.current?.focus();
						}
					}}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
				>
					{input ? (
						<FilterX className="w-4 h-4" />
					) : (
						<Filter className="w-4 h-4" />
					)}
				</button>
			</div>
			<div className="flex gap-4 flex-wrap pt-4">
				<WorkflowCard
					onClick={() => onChange("Object Detection")}
					name="Object Detection"
					description="localize and classify objects in images."
					imageUrl={""}
					tags={["Counting", "Locate", "Identify"]}
				/>
			</div>
		</div>
	);
};
