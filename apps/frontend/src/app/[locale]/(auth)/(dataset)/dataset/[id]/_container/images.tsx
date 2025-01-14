"use client";
import { ViewList } from "@/components/specific/viewList";
import { Header, Primary } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadFile from "@/components/ui/uploadfile";
import { ContentImage } from "@/features/dataset/components/image";
import { FileUp, Filter, Image } from "lucide-react";

export default function ImagesPage() {
	return (
		<ViewList.Provider>
			<Header className=" inline-flex items-center gap-x-2">
				<Image /> Images
			</Header>

			<div className="flex justify-between mb-2">
				<div className="flex flex-wrap gap-y-4 space-x-4 w-full">
					<Input placeholder="search images ..." className=" max-w-lg" />
					<Button className="bg-indigo-900 hover:bg-indigo-950 dark:opacity-40 dark:bg-indigo-900 dark:hover:bg-indigo-950">
						<Filter /> Filter
					</Button>
					<UploadFile.dialog
						button=<Button
							variant="outline"
							className="border-indigo-900 hover:border-indigo-950 dark:border-indigo-100 dark:hover:border-indigo-100 text-indigo-900 hover:text-indigo-950 dark:text-indigo-100 dark:hover:text-indigo-100"
						>
							<FileUp /> Upload Image
						</Button>
						dialog={{
							title: "Upload Images",
							description: "",
						}}
						id=""
						onFileChange={() => {}}
					/>
				</div>
				<div>
					<ViewList.Trigger />
				</div>
			</div>
			<ContentImage />
		</ViewList.Provider>
	);
}
