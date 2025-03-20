"use client";
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
import { useToast } from "@/hooks/use-toast";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { cn } from "@/libs/utils";
import type { ResponseImage } from "@/types/response/dataset";
import { getImageSize } from "@/utils/image-size";
import { Ellipsis } from "lucide-react";
import { useFormatter } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeBase64, encodeBase64 } from "../../../libs/base64";

export const ContentImage = ({
	id,
	images,
	total,
}: {
	images: ResponseImage[] | undefined;
	total: number | undefined;
	id: string;
}) => {
	const viewList = ViewList.useViewListState();
	const [imageSizes, setImageSizes] = useState<
		{ width: number; height: number }[]
	>([]);
	const format = useFormatter();
	const { toast } = useToast();
	const { asyncRoute } = useRouterAsync();

	const { mutateAsync: deleteImage } = useDeleteImageByPath();

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
				<div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
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
							<div className="mx-auto flex-shrink-0">
								<Subtle className="text-xs text-gray-500">
									{imageSizes[index]?.width} x {imageSizes[index]?.height} px
								</Subtle>
							</div>
							<div>
								<Subtle className="text-xs flex-shrink-0">
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
