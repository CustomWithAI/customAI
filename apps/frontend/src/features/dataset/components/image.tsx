"use client";
import { ViewList } from "@/components/specific/viewList";
import { Content, Subtle } from "@/components/typography/text";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/libs/utils";
import type { ResponseImage } from "@/types/response/dataset";
import { getImageSize } from "@/utils/image-size";
import { Ellipsis } from "lucide-react";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { decodeBase64 } from "../../../libs/base64";

export const ContentImage = ({
	images,
	total,
}: { images: ResponseImage[] | undefined; total: number | undefined }) => {
	const viewList = ViewList.useViewListState();
	const [imageSizes, setImageSizes] = useState<
		{ width: number; height: number }[]
	>([]);
	const format = useFormatter();

	useEffect(() => {
		if (images) {
			const fetchImageSizes = async () => {
				const sizes = await Promise.all(
					images.map(async (image) => {
						const size = await getImageSize(image.url);
						return size;
					}),
				);
				setImageSizes(sizes);
			};

			fetchImageSizes();
		}
	}, [images]);

	if (!images || !total) {
		return <></>;
	}
	return (
		<>
			<Subtle className="text-xs mb-3 font-medium">
				Found {total} {total > 1 ? "images" : "image"}
			</Subtle>
			{viewList === "Grid" ? (
				<div className="grid grid-cols-4 gap-4">
					{images.map((image, index) => (
						<div
							key={index}
							className="relative flex flex-col items-center justify-center text-center"
						>
							<div className="relative">
								<img
									src={image.url}
									alt={image.path}
									width={150}
									height={150}
									className="max-w-full max-h-full rounded-md"
								/>
								<div className="absolute top-2 right-2">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<div className="p-1 rounded-full bg-white hover:bg-zinc-100">
												<Ellipsis className="w-4 h-4" />
											</div>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem>Annotate</DropdownMenuItem>
											<DropdownMenuItem className="text-red-500">
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
							<div className="mt-2">
								<Subtle
									className={cn(
										"text-left",
										{ "text-green-500": image.class },
										{ "text-red-500": !image.class },
									)}
								>
									{image.class ? "annotated" : "unannotated"}
								</Subtle>
								<p className="text-xs text-gray-400">
									{imageSizes[index]?.width} x {imageSizes[index]?.height} px
								</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="list overflow-scroll">
					{images.map((image, index) => (
						<div
							key={index}
							className="mb-4 flex w-full text-center items-center gap-8"
						>
							<img
								src={image.url}
								className="rounded-md"
								alt={image.path}
								width={48}
								height={48}
							/>
							<div>
								<Content className="min-w-0 text-left flex-1 truncate">
									{image.class ?? "Unlabeled class"}
								</Content>
								<Subtle
									className={cn(
										"text-left",
										{ "text-green-500": image.class },
										{ "text-red-500": !image.class },
									)}
								>
									{image.class ? "annotated" : "unannotated"}
								</Subtle>
							</div>
							<div className="mx-auto flex-shrink-0">
								<Subtle className="text-gray-500">
									{imageSizes[index]?.width} x {imageSizes[index]?.height} px
								</Subtle>
							</div>
							<div>
								<Subtle className="flex-shrink-0">
									{format.relativeTime(new Date(image.createdAt))}
								</Subtle>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};
