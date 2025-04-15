"use client";
import { ViewList } from "@/components/specific/viewList";
import { Header, Primary } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadFile from "@/components/ui/uploadfile";
import { ContentImage } from "@/features/dataset/components/image";
import { useGetImages } from "@/hooks/queries/dataset-api";
import { encodeBase64 } from "@/libs/base64";
import { useRouter } from "@/libs/i18nNavigation";
import { useQueryClient } from "@tanstack/react-query";
import { FileUp, Filter, Image, PaintbrushVertical } from "lucide-react";

export default function ImagesPage({ id }: { id: string }) {
	const { data: images } = useGetImages(id);
	const router = useRouter();
	const queryClient = useQueryClient();
	return (
		<ViewList.Provider>
			<Header className=" inline-flex items-center gap-x-2">
				<Image /> Images
			</Header>

			<div className="flex justify-between mb-2">
				<div className="flex flex-wrap gap-y-4 space-x-4 w-full">
					<Input placeholder="search images ..." className=" max-w-lg" />
					<Button>
						<Filter /> Filter
					</Button>
					<UploadFile.dialog
						button=<Button variant="outline">
							<FileUp /> Upload Image
						</Button>
						dialog={{
							title: "Upload Images",
							description: "",
						}}
						datasetId={id}
						id=""
						onFileChange={() => {
							queryClient.invalidateQueries({
								queryKey: ["datasets", "images", id],
							});
						}}
					/>
					<Button
						onClick={() =>
							router.push(
								`/dataset/${id}/annotation/?image=${encodeBase64(images?.data?.[0]?.path ?? "")}`,
							)
						}
						effect="gooeyLeft"
					>
						<PaintbrushVertical /> Annotate
					</Button>
				</div>
				<div>
					<ViewList.Trigger />
				</div>
			</div>
			<ContentImage id={id} total={images?.total} />
		</ViewList.Provider>
	);
}
