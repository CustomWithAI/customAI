import { FormBuilder } from "@/components/builder/form";
import { ContentHeader } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import EnhanceImage from "@/components/ui/enhanceImage";
import { useDragStore } from "@/contexts/dragContext";
import { cn } from "@/libs/utils";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import { AnimatePresence, motion } from "framer-motion";
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

	const preview = useMemo(() => {
		return node(fields, onUpdateMetadata)
			.filter((field) => fields.map((field) => field.id).includes(field.id))
			.flatMap((field) => field.previewImg)
			.filter((item) => item !== undefined);
	}, [fields, onUpdateMetadata, node]);

	if (!input?.inputSchema || !input?.inputField) return;
	return (
		<div className="flex max-h-[70vh] max-md:flex-col gap-x-6 max-md:gap-y-6 w-full">
			<div
				className={cn(
					"relative h-[70vh] w-full md:w-1/2 dark:bg-black border rounded-lg shadow-sm bg-white overflow-scroll",
					"dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center",
				)}
			>
				<div className="absolute flex flex-col z-50 rounded-md bg-white bottom-2 left-2 border border-blue-500">
					<motion.div
						layoutId="activeIndicator"
						className="absolute w-24 h-9 bg-blue-500 rounded m-0.5"
						transition={{ type: "spring", stiffness: 300, damping: 20 }}
						animate={{ top: mode === "main" ? 0 : "2.35rem" }}
					/>
					<button
						aria-selected={mode === "main"}
						type="button"
						onClick={() => setMode("main")}
						className="aria-selected:text-white w-24 z-[60] text-sm rounded-sm m-0.5 mb-0 text-center py-2"
					>
						specific
					</button>
					<button
						aria-selected={mode === "combine"}
						type="button"
						onClick={() => setMode("combine")}
						className="aria-selected:text-white w-24 z-[60] text-sm rounded-sm m-0.5 text-center py-2"
					>
						preview
					</button>
				</div>
				<div className="relative aspect-square items-center flex justify-center h-full w-5/6 ">
					<EnhanceImage
						imagePath={image}
						filters={mode === "combine" ? preview : input.previewImg || []}
						className="h-full w-full object-contain rounded-md"
					/>
				</div>
			</div>
			<div className="w-full md:w-1/2 h-full">
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
