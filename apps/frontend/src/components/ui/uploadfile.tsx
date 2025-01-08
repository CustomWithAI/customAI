import { Progress } from "@/components/ui/progress";
import { useUploadFile } from "@/hooks/mutations/uploadfile-api";
import { cn } from "@/libs/utils";
import { CloudUpload, X } from "lucide-react";
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
	const [files, setFiles] = useState<FileUpload[]>([]);
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
				setFiles((prev) => [...prev, newFile]);
				try {
					await uploadFile(
						{
							file,
							progressCallbackFn: (value) => {
								setFiles((prev) =>
									prev.map((f) =>
										f.file === file ? { ...f, progress: value } : f,
									),
								);
							},
							purpose: id,
						},
						{
							onSuccess: (data) => {
								setFiles((prev) =>
									prev.map((f) =>
										f.file === file ? { ...f, id: data.id, url: data.url } : f,
									),
								);
								uploadedFiles.push({
									id: data.id,
									url: data.url,
								});
							},
						},
					);
				} catch (error) {
					console.error(error);
					setFiles((prev) =>
						prev.map((f) => (f.file === file ? { ...f, error: true } : f)),
					);
				}
			}
			for (const rejected of rejectedFiles) {
				const { file, errors } = rejected;
				console.warn(`File ${file.name} was rejected:`, errors);
				setFiles((prev) => [
					...prev,
					{
						file,
						uid: `${file.name}-${file.lastModified}-${Math.random()}`,
						progress: 0,
						error: true,
					},
				]);
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

	const handleDelete = (fileId?: string) => {
		if (!fileId) {
			return;
		}
		setFiles((prev) => prev.filter((f) => f.id !== fileId));
		if (onDelete) {
			onDelete(fileId);
		}
	};

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
					<Content className="select-none">Drop the file here ...</Content>
				) : isDragReject || isFileTooBig ? (
					<Content className="px-4 Content-center select-none">
						These file is too big to be uploaded
					</Content>
				) : (
					<Content className="px-4 Content-center select-none">
						Drop &rsquo;n drop file here, or click to select files
					</Content>
				)}
			</button>
			{files.length > 0 &&
				files.map((uploadedFile) => (
					<div
						key={uploadedFile.id || uploadedFile.file.name}
						className={cn(
							"mt-2 flex w-full rounded-lg border p-4 pr-2 shadow-md max-sm:flex-col",
							{ "border-red-500": uploadedFile.error },
						)}
					>
						<Image
							alt="imageUrl"
							src={URL.createObjectURL(uploadedFile.file)}
							width={36}
							height={36}
							className="mr-3 size-10 rounded-lg shadow-md"
						/>
						<div className="mr-4 flex-1 max-sm:flex-col">
							<p className="flex-1 hyphens-auto break-all">
								{uploadedFile.file.name}
							</p>
							<Content className="Content-nowrap">
								{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
							</Content>
						</div>
						<div className="my-auto flex flex-1 items-center justify-end">
							<div className="w-32">
								<Progress
									value={uploadedFile.error ? 100 : uploadedFile.progress}
									error={uploadedFile.error}
									className={cn("h-2")}
								/>
							</div>
							<button
								type="button"
								className="ml-1 rounded-full p-2 hover:bg-zinc-50 dark:hover:bg-zinc-700"
								onClick={() => {
									if (uploadedFile.error) {
										setFiles((prev) =>
											prev.filter((file) => file.uid !== uploadedFile.uid),
										);
									}
									handleDelete(uploadedFile.id);
								}}
							>
								<X width={12} />
							</button>
						</div>
					</div>
				))}
		</>
	);
}
