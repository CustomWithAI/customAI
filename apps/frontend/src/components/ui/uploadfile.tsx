import { Progress } from "@/components/ui/progress";
import { useUploadFile } from "@/hooks/mutations/uploadfile-api";
import { cn } from "@/libs/utils";
import { CloudUpload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { type ElementRef, useCallback, useRef, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { Content } from "../typography/text";

type UploadedFile = { id: string; url?: string }[];

type UploadFileType = {
	id: string;
	onFileChange: (files: UploadedFile) => void;
	onDelete?: (fileId: string) => void;
};

type FileUpload = {
	uid: string;
	file: File;
	progress: number;
	id?: string;
	url?: string;
	error?: boolean;
};

export default function UploadFile({
	onFileChange,
	id,
	onDelete,
}: UploadFileType) {
	const t = useTranslations();
	const [isFileTooBig, setIsFileTooBig] = useState(false);
	const inputRef = useRef<ElementRef<"input">>(null);

	const { mutateAsync: uploadFile } = useUploadFile();

	const onDrop = useCallback(
		async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			const uploadedFiles: UploadedFile = [];
			console.log(acceptedFiles.length);
			for (const file of acceptedFiles) {
				const newFile: FileUpload = {
					uid: `${file.name}-${file.lastModified}-${Math.random()}`,
					id: "",
					file,
					progress: 0,
				};
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
					"flex aspect-video z-10 size-full flex-col items-center justify-center rounded-lg border",
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
				<CloudUpload width={32} />
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
}
