"use client";
import { ViewList } from "@/components/specific/viewList";
import { Content, Subtle } from "@/components/typography/text";
import type { ResponseImage } from "@/types/response/dataset";
import { getImageSize } from "@/utils/image-size";
import { useFormatter } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

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
							className="flex flex-col items-center justify-center text-center"
						>
							<img
								src={image.url}
								alt={image.path}
								width={150}
								height={150}
								className="max-w-full max-h-full"
							/>
							<div className="mt-2">
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
							<img src={image.url} alt={image.path} width={32} height={32} />
							<Content className="min-w-0 flex-1 truncate">
								{image.path.split("_")?.[1]}
							</Content>
							<div className="mx-auto flex-shrink-0">
								<p className="text-xs text-gray-500">
									{imageSizes[index]?.width} x {imageSizes[index]?.height} px
								</p>
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
