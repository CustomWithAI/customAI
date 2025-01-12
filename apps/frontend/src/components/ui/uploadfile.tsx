"use client";
import { useUploadFile } from "@/hooks/mutations/uploadfile-api";
import { cn } from "@/libs/utils";
import { FileText, FileVideo2, ImageIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	type ElementRef,
	type ReactNode,
	createElement,
	useCallback,
	useRef,
	useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { Content } from "../typography/text";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

type UploadedFile = { id: string; url?: string }[];

type UploadFileType = {
	id: string;
	onFileChange: (files: UploadedFile) => void;
	onDelete?: (fileId: string) => void;
};

type UploadFileDialog = {
	button: ReactNode;
	dialog: {
		title: ReactNode;
		description: ReactNode;
	};
} & UploadFileType;

const icons = [ImageIcon, FileText, FileVideo2];

const UploadFileBox = ({ onFileChange, id, onDelete }: UploadFileType) => {
	const t = useTranslations();
	const [isFileTooBig, setIsFileTooBig] = useState(false);
	const inputRef = useRef<ElementRef<"input">>(null);

	const { mutateAsync: uploadFile } = useUploadFile();

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const uploadedFiles: UploadedFile = [];
			for (const file of acceptedFiles) {
				try {
					await uploadFile({
						file,
						purpose: id,
					});
				} catch (error) {
					console.error(error);
				}
			}
			onFileChange(uploadedFiles);
		},
		[id, uploadFile, onFileChange],
	);

	const { getRootProps, getInputProps, isDragActive, isDragReject } =
		useDropzone({
			multiple: true,
			onDrop,
			accept: {
				"image/jpeg": [".jpeg", ".png"],
				"application/pdf": [".pdf"],
			},
			onDropRejected: () => setIsFileTooBig(true),
			onDropAccepted: () => setIsFileTooBig(false),
		});

	return (
		<>
			<button
				type="button"
				{...getRootProps()}
				onClick={(e) => {
					e.preventDefault();
					inputRef.current?.click();
				}}
				className={cn(
					"group flex aspect-square sm:aspect-video z-10 size-full flex-col items-center justify-center rounded-lg border",
					"cursor-pointer border-dashed shadow-sm duration-150 hover:bg-zinc-50 active:bg-zinc-100/70 dark:bg-zinc-700",
					"dark:bg-zinc-700",
					{
						"bg-zinc-100 dark:border-zinc-400 dark:bg-zinc-800": isDragActive,
					},
					{ "border-red-500": isDragReject || isFileTooBig },
				)}
			>
				<input
					{...getInputProps()}
					ref={inputRef}
					accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
				/>
				<div className="flex justify-center isolate pb-4">
					<>
						<div
							className={cn(
								"bg-white size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-border ring-zinc-300",
								" group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200",
								{ "-translate-x-5 -translate-y-0.5": isDragActive },
							)}
						>
							{createElement(icons[0], {
								className: "w-6 h-6 text-muted-foreground",
							})}
						</div>
						<div
							className={cn(
								"bg-white size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-border ring-zinc-300",
								" group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200",
								{ "-translate-y-0.5": isDragActive },
							)}
						>
							{createElement(icons[1], {
								className: "w-6 h-6 text-muted-foreground",
							})}
						</div>
						<div
							className={cn(
								"bg-white size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 ",
								" shadow-lg ring-1 ring-border ring-zinc-300 group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200",
								{ "-translate-y-0.5 translate-x-5": isDragActive },
							)}
						>
							{createElement(icons[2], {
								className: "w-6 h-6 text-muted-foreground",
							})}
						</div>
					</>
				</div>
				{isDragActive ? (
					<Content className="select-none">
						{t("Upload.Dialog.DropTheFileHere")}
					</Content>
				) : isDragReject || isFileTooBig ? (
					<Content className="px-4 Content-center select-none">
						{t("Upload.Dialog.fileIsTooBig")}
					</Content>
				) : (
					<Content className="px-4 Content-center select-none">
						{t("Upload.Dialog.DropFileHere")}
					</Content>
				)}
			</button>
		</>
	);
};

const UploadFileDialog = ({
	button,
	dialog,
	...uploadFileProps
}: UploadFileDialog) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{button}</DialogTrigger>
			<DialogContent className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-white">
				<DialogHeader>
					<DialogTitle>{dialog.title}</DialogTitle>
					<DialogDescription>{dialog.description}</DialogDescription>
				</DialogHeader>
				<UploadFileBox {...uploadFileProps} />
			</DialogContent>
		</Dialog>
	);
};

const UploadFile = {
	box: UploadFileBox,
	dialog: UploadFileDialog,
};

export default UploadFile;
