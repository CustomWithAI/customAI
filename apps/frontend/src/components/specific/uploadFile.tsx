"use client";

import {
	AlertCircleIcon,
	PaperclipIcon,
	UploadIcon,
	XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	type FileWithPreview,
	formatBytes,
	useFileUpload,
} from "@/hooks/use-file-upload";

export default function UploadFile({
	onChange,
}: { onChange: (files: FileWithPreview[]) => void }) {
	const maxSize = 200 * 1024 * 1024;

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		maxSize,
		onFilesChange: onChange,
	});

	const file = files[0];

	return (
		<div className="flex flex-col gap-2">
			{file ? (
				<div className="space-y-2">
					<div
						key={file.id}
						className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 px-4 py-2"
					>
						<div className="flex items-center gap-3 overflow-hidden">
							<PaperclipIcon
								className="size-4 shrink-0 opacity-60"
								aria-hidden="true"
							/>
							<div className="flex flex-col min-w-0">
								<p className="truncate text-[13px] font-medium">
									{file.file.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatBytes(file.file.size)}
								</p>
							</div>
						</div>

						<Button
							size="icon"
							variant="ghost"
							className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
							onClick={() => removeFile(files[0]?.id)}
							aria-label="Remove file"
						>
							<XIcon className="size-4" aria-hidden="true" />
						</Button>
					</div>
				</div>
			) : (
				<button
					type="button"
					onClick={openFileDialog}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					data-dragging={isDragging || undefined}
					className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-24 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
				>
					<input
						{...getInputProps()}
						className="sr-only"
						aria-label="Upload file"
						disabled={Boolean(file)}
					/>

					<div className="flex flex-col items-center justify-center text-center">
						<p className="mb-1.5 text-sm font-medium">Upload file</p>
						<p className="text-muted-foreground text-xs">
							Drag & drop or click to browse (max. {formatBytes(maxSize)})
						</p>
					</div>
				</button>
			)}

			{errors.length > 0 && (
				<div className="text-destructive flex items-center gap-1 text-xs">
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
}
