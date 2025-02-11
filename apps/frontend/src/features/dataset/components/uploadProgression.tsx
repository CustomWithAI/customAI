"use client";
import { Content, SubHeader, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/libs/utils";
import { useUploadStore } from "@/stores/uploadStore";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const UploadProgress = () => {
	const t = useTranslations();
	const [collapse, setCollapse] = useState<boolean>(false);
	const uploads = useUploadStore((state) => state.uploads);
	const updateCanceled = useUploadStore((state) => state.updateCanceled);
	const cancelUpload = useUploadStore((state) => state.cancelUpload);
	const resetUpload = useUploadStore((state) => state.resetUpload);

	const handleCancel = (
		id: string,
		isFinished: boolean,
		abortController: AbortController,
	) => {
		if (isFinished) {
			cancelUpload(id);
		} else {
			abortController.abort();
			updateCanceled(id);
		}
	};

	useEffect(() => {
		if (uploads.some((file) => !file.completed)) {
			return;
		}
		setTimeout(() => {
			resetUpload();
		}, 7 * 1000);
	}, [resetUpload, uploads]);

	if (uploads.length === 0) return null;
	return (
		<div className="fixed bottom-4 right-4 max-sm:w-screen z-[99] bg-white border border-gray-200 rounded-lg p-6 pt-5 shadow-md">
			<div className="flex justify-between border-b pb-2">
				<SubHeader>
					{t("Upload.Popup.Upload")}{" "}
					<span className="text-zinc-400 text-base font-medium">
						({uploads.length})
					</span>
				</SubHeader>
				<div className="flex space-x-2">
					<Button
						type="button"
						variant="ghost"
						className="p-2 h-8"
						onClick={resetUpload}
					>
						<X className="h-5 w-5" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						className="p-2 h-8"
						onClick={() => setCollapse((prev) => !prev)}
					>
						{collapse ? (
							<ChevronUp className="h-5 w-5" />
						) : (
							<ChevronDown className="h-5 w-5" />
						)}
					</Button>
				</div>
			</div>
			<motion.div
				initial={{ height: 0, opacity: 0 }}
				animate={{ height: collapse ? 0 : "auto", opacity: collapse ? 0 : 1 }}
				exit={{ height: 0, opacity: 0 }}
				transition={{ duration: 0.35, ease: "easeInOut" }}
				className="mt-4 space-y-2"
			>
				{uploads.map(
					({
						id,
						filename,
						progress,
						error,
						canceled,
						file,
						completed,
						abortController,
					}) => (
						<div
							key={id}
							className={cn("mt-2 pb-2 flex w-full", {
								"border-red-500": error,
							})}
						>
							<Image
								alt="imageUrl"
								src={URL.createObjectURL(file)}
								width={36}
								height={36}
								className="mr-3 size-10 rounded-lg shadow-md bg-cover"
							/>
							<div className="mr-4 -mt-0.5 flex-1 max-sm:flex-col">
								<Content className="flex-1 hyphens-auto break-all min-w-32">
									{filename}
								</Content>
								<Subtle
									className={cn("Content-nowrap text-gray-400", {
										"text-red-400": canceled,
									})}
								>
									{canceled
										? "canceled"
										: `${(file.size / 1024 / 1024).toFixed(2)} MB`}
								</Subtle>
							</div>
							<div className="my-auto flex flex-1 items-center justify-end">
								{canceled ? (
									<div className="w-28 max-sm:w-20" />
								) : (
									<div className="w-28 max-sm:w-20">
										<Progress
											value={error ? 100 : progress}
											error={error}
											className={cn("h-2")}
										/>
									</div>
								)}
								{completed ? (
									<Check className="text-green-600" />
								) : (
									<Button
										type="button"
										variant="ghost"
										className="hover:bg-red-100 w-6 p-5 ml-2"
										onClick={() =>
											handleCancel(
												id,
												completed || error || canceled || false,
												abortController,
											)
										}
									>
										<X className="h-5 w-5" />
									</Button>
								)}
							</div>
						</div>
					),
				)}
			</motion.div>
		</div>
	);
};

export default UploadProgress;
