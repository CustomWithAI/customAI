"use client";
import { InfiniteTable } from "@/components/layout/InfinityTable";
import { InfiniteGrid } from "@/components/layout/infinityGrid";
import { FilterDialog } from "@/components/specific/filter/dialog";
import { ViewList } from "@/components/specific/viewList";
import { Content, Header, Primary, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { DotBadge } from "@/components/ui/dot-badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import UploadFile from "@/components/ui/uploadfile";
import { ContentImage } from "@/features/dataset/components/image";
import { useDeleteImageByPath } from "@/hooks/mutations/dataset-api";
import { useGetImages, useGetInfImages } from "@/hooks/queries/dataset-api";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { useFilters } from "@/hooks/useFilter";
import { encodeBase64 } from "@/libs/base64";
import {
	type FieldOptions,
	generateFilterOptions,
} from "@/libs/generateFilterOptions";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { useRouter } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import type { FilterConfig } from "@/types/filter";
import type { ResponseImage } from "@/types/response/dataset";
import { getImageSize } from "@/utils/image-size";
import { useQueryClient } from "@tanstack/react-query";
import {
	Ellipsis,
	FileUp,
	Filter,
	Image,
	PaintbrushVertical,
} from "lucide-react";
import { useFormatter } from "next-intl";
import { useState } from "react";

const filterConfig: FilterConfig<ResponseImage> = {
	path: ["filter", "search", "sort"],
	createdAt: ["sort"],
};

const fieldOptions: FieldOptions = {};

export default function ImagesPage({ id }: { id: string }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { data: images } = useGetImages(id);
	const router = useRouter();
	const queryClient = useQueryClient();

	const { relativeTime } = useFormatter();
	const { toast } = useToast();
	const { asyncRoute } = useRouterAsync();
	const { filters, setFilter, resetFilters, getParams, setManualFilter } =
		useFilters({
			config: filterConfig,
		});

	const setFilterName = useDebounceCallback((name) =>
		setManualFilter("path", name, "search"),
	);
	const filterOptions = generateFilterOptions(filterConfig, fieldOptions);

	const { mutateAsync: deleteImage } = useDeleteImageByPath();
	const imageQuery = useGetInfImages({
		id,
		params: getParams() as Record<string, string>,
	});

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
	return (
		<ViewList.Provider>
			<Header className=" inline-flex items-center gap-x-2">
				<Image /> Images
			</Header>

			<div className="flex justify-between mb-2">
				<div className="flex flex-wrap gap-y-4 space-x-4 w-full">
					<Input
						placeholder="search images ..."
						onChange={(v) => setFilterName(v.target.value)}
						className=" max-w-lg"
					/>
					<Button onClick={() => setDialogOpen(true)}>
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
			<Subtle className="text-xs mb-3 font-medium">
				Found {images?.total} {(images?.total || 0) > 1 ? "images" : "image"}
			</Subtle>
			<ViewList.Grid>
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
			</ViewList.Grid>
			<ViewList.Vertical>
				<InfiniteTable
					query={imageQuery}
					className="-mt-12"
					keyField="path"
					bordered={true}
					striped={true}
					clickableRows={true}
					columns={[
						{
							header: "Image",
							accessorKey: "url",
							type: "bold",
							cell: (image) => {
								return (
									<div className="flex gap-x-2">
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
													image.annotation?.annotation
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
									</div>
								);
							},
						},
						{
							header: "Size",
							accessorKey: "path",
							cell: (image) => {
								getImageSizeWithCache(image.url);
								const imageSize = imageSizeCache[image.url];
								return (
									<Subtle className="text-xs text-gray-500">
										{imageSize?.width} x {imageSize?.height} px
									</Subtle>
								);
							},
						},
						{
							header: "Created At",
							accessorKey: "createdAt",
							type: "muted",
							cell: (item) => relativeTime(new Date(item.createdAt)),
						},
					]}
				/>
			</ViewList.Vertical>
			<FilterDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				filterOptions={filterOptions}
				values={filters}
				onApply={(key, value) => setFilter(key, value)}
				onReset={resetFilters}
			/>
		</ViewList.Provider>
	);
}
