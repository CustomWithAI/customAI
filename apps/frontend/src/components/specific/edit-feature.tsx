import { FormBuilder } from "@/components/builder/form";
import { ContentHeader } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import EnhanceImage from "@/components/ui/enhanceImage";
import { useDragStore } from "@/contexts/dragContext";
import { cn } from "@/libs/utils";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import { useMemo, useState } from "react";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export const EditFeature = ({
	id,
	node,
	image,
}: {
	id: string;
	image: string;
	node: (
		fields: DragColumn<z.ZodRawShape>[],
		onUpdateMetadata: (payload: {
			id: string;
			metadata: Metadata;
		}) => void,
	) => DragColumn[];
}) => {
	const [mode, setMode] = useState<"main" | "combine">("main");
	const fields = useDragStore(useShallow((state) => state.fields));
	const onUpdateMetadata = useDragStore(
		useShallow((state) => state.onUpdateMetadata),
	);
	const input = useMemo(() => {
		return node(fields, onUpdateMetadata).find((field) => field.id === id);
	}, [fields, onUpdateMetadata, node, id]);

	if (!input?.inputSchema || !input?.inputField) return;
	return (
		<div className="flex max-h-[70vh] gap-x-6 w-full">
			<div
				className={cn(
					"relative h-[70vh] w-1/2 dark:bg-black border rounded-lg shadow-sm bg-white overflow-scroll",
					"dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center",
				)}
			>
				<div className="absolute flex flex-col z-50 rounded-md bg-white bottom-2 left-2 border">
					<button
						aria-selected={mode === "main"}
						type="button"
						className="aria-selected:bg-blue-500 aria-selected:text-white w-24 text-sm rounded-sm m-1 mb-0 text-center py-2"
					>
						specific
					</button>
					<button
						type="button"
						className="w-24 text-sm rounded-sm hover:bg-zinc-50 m-0.5 text-center py-2"
					>
						preview
					</button>
				</div>
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
