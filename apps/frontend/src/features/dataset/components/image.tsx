"use client";
import { InfiniteGrid } from "@/components/layout/infinityGrid";
import { WindowList } from "@/components/layout/windowList";
import { ViewList } from "@/components/specific/viewList";
import { Content, Subtle, Tiny } from "@/components/typography/text";
import { DotBadge } from "@/components/ui/dot-badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteImageByPath } from "@/hooks/mutations/dataset-api";
import { useGetInfImages } from "@/hooks/queries/dataset-api";
import { useToast } from "@/hooks/use-toast";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { cn } from "@/libs/utils";
import type { ResponseImage } from "@/types/response/dataset";
import { getImageSize } from "@/utils/image-size";
import { Ellipsis } from "lucide-react";
import { useFormatter } from "next-intl";
import { useState } from "react";
import { encodeBase64 } from "../../../libs/base64";

export const ContentImage = ({
	id,
	total,
}: {
	total: number | undefined;
	id: string;
}) => {
	const viewList = ViewList.useViewListState();

	const format = useFormatter();
	const { toast } = useToast();
	const { asyncRoute } = useRouterAsync();

	const { mutateAsync: deleteImage } = useDeleteImageByPath();
	const imageQuery = useGetInfImages({ id });

	const [imageSizeCache, setImageSizeCache] = useState<
		Record<string, { width: number; height: number } | null>
	>({});

	const getImageSizeWithCache = async (url: string) => {
		if (imageSizeCache[url] !== undefined) {
			return imageSizeCache[url];
		}

		try {
			const size = await getImageSize(url);
			setImageSizeCache((prev) => ({ ...prev, [url]: size }));
			return size;
		} catch (error) {
			console.error("Failed to get image size:", error);
			setImageSizeCache((prev) => ({ ...prev, [url]: null }));
			return null;
		}
	};

	if (!total) {
		return <></>;
	}

	return (
		<>
			<Subtle className="text-xs mb-3 font-medium">
				Found {total} {total > 1 ? "images" : "image"}
			</Subtle>
			{viewList === "Grid" ? (
				<InfiniteGrid
					query={imageQuery}
					columns="auto"
					renderItem={(image, index) => {
						getImageSizeWithCache(image.url);
						const imageSize = imageSizeCache[image.url];
						return (
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
												<DropdownMenuItem
													onClick={async () => {
														await asyncRoute(
															`/dataset/${id}/annotation/?image=${encodeBase64(image.path)}`,
														);
													}}
												>
													Annotate
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={async () => {
														await deleteImage(
															{
																id,
																path: image.path,
															},
															{
																onSuccess: (_, params) => {
																	toast({
																		title: `remove ${decodeURIComponent(params.path)} image from dataset`,
																	});
																},
															},
														);
													}}
													className="text-red-500"
												>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
								<div className="mt-2">
									<Subtle
										className={cn(
											"text-center",
											{
												"text-green-500":
													image.annotation?.label ||
													(image.annotation?.annotation &&
														(image.annotation?.annotation?.length || 0) > 0),
											},
											{
												"text-red-500": !(
													image.annotation?.label ||
													(image.annotation?.annotation &&
														(image.annotation?.annotation?.length || 0) > 0)
												),
											},
										)}
									>
										{image.annotation?.label ||
										(image.annotation?.annotation &&
											(image.annotation?.annotation?.length || 0) > 0)
											? "annotated"
											: "unannotated"}
									</Subtle>
									<p className="text-xs text-gray-400">
										{imageSize?.width} x {imageSize?.height} px
									</p>
								</div>
							</div>
						);
					}}
				/>
			) : (
				<WindowList
					query={imageQuery}
					direction="vertical"
					className="space-y-3"
					itemContent={(index, image) => {
						getImageSizeWithCache(image.url);
						const imageSize = imageSizeCache[image.url];
						return (
							<div
								key={index}
								className="mb-4 flex w-full text-center items-center gap-8"
							>
								<img
									src={image.url}
									className="rounded-md"
									alt={image.path}
									width={52}
									height={52}
								/>
								<div className="w-1/2 flex-col flex justify-start">
									<Content className="min-w-0 text-left flex-1 truncate">
										{image.annotation?.label ||
											image.annotation.annotation
												?.map((annotate) => annotate.label)
												?.join(", ") ||
											"Unlabeled class"}
									</Content>
									<div className="w-fit">
										<DotBadge
											variant={
												image.annotation?.label ||
												(image.annotation?.annotation &&
													(image.annotation?.annotation?.length || 0) > 0)
													? "success"
													: "danger"
											}
											className={cn("text-left")}
										>
											{image.annotation?.label ||
											(image.annotation?.annotation &&
												(image.annotation?.annotation?.length || 0) > 0)
												? "annotated"
												: "unannotated"}
										</DotBadge>
									</div>
								</div>
								<div className="mx-auto shrink-0">
									<Subtle className="text-xs text-gray-500">
										{imageSize?.width} x {imageSize?.height} px
									</Subtle>
								</div>
								<div>
									<Subtle className="text-xs shrink-0">
										{format.relativeTime(new Date(image.createdAt))}
									</Subtle>
								</div>
							</div>
						);
					}}
				/>
			)}
		</>
	);
};
