import { FormBuilder } from "@/components/builder/form";
import { ContentHeader } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import EnhanceImage from "@/components/ui/enhanceImage";
import { node } from "@/configs/image-preprocessing";
import { useDragStore } from "@/contexts/dragContext";
import { cn } from "@/libs/utils";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export const EditFeature = ({ id, image }: { id: string; image: string }) => {
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
					"h-[70vh] w-1/2 dark:bg-black border rounded-lg shadow-sm bg-white",
					"dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center",
				)}
			>
				<div className="relative aspect-square items-center flex justify-center h-full w-5/6 ">
					<EnhanceImage
						imagePath={image}
						filters={input.previewImg || []}
						className="h-full w-full object-contain rounded-md"
					/>
				</div>
			</div>
			<div className="w-1/2 h-full">
				<ContentHeader className="border-b mb-4">config</ContentHeader>
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
							Close
						</Button>
					</DialogClose>
				</div>
			</div>
		</div>
	);
};
