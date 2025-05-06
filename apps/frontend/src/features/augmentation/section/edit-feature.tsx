import { FormBuilder } from "@/components/builder/form";
import { ContentHeader } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { node } from "@/configs/fields/augmentation";
import { useDragStore } from "@/contexts/dragContext";
import { cn } from "@/libs/utils";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export const EditFeature = ({ id }: { id: string }) => {
	const fields = useDragStore(useShallow((state) => state.fields));
	const onUpdateMetadata = useDragStore(
		useShallow((state) => state.onUpdateMetadata),
	);
	const input = useMemo(() => {
		return node(fields, onUpdateMetadata).find((field) => field.id === id);
	}, [fields, onUpdateMetadata, id]);

	if (!input?.inputSchema || !input?.inputField) return;

	return (
		<div className="flex max-h-[70vh] gap-x-6">
			<div
				className={cn(
					"h-[70vh] w-1/2 dark:bg-black border border-gray-200 rounded-lg shadow-xs bg-white",
					"relative flex items-center justify-center",
					"[background-size:20px_20px]",
					"[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
					"dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
				)}
			>
				a
			</div>
			<div className="w-1/2 h-full">
				<ContentHeader className="border-b border-gray-200 mb-4">
					config
				</ContentHeader>
				<FormBuilder.Provider
					formName={`form-${id}`}
					schema={input.inputSchema}
				>
					<FormBuilder.Build
						schema={input.inputSchema}
						formFields={input.inputField}
					/>
				</FormBuilder.Provider>
				<div className="mt-6 w-full">
					<DialogClose asChild>
						<Button variant="secondary" className="ml-auto">
							Save
						</Button>
					</DialogClose>
				</div>
			</div>
		</div>
	);
};
