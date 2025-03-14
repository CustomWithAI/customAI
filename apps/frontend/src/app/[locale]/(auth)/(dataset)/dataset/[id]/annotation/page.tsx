"use client";
import { BaseSkeleton } from "@/components/specific/skeleton";
import AnnotationSection from "@/features/canvas/annotation";
import {
	useGetDataset,
	useGetImages,
	useGetSurroundingImages,
} from "@/hooks/queries/dataset-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64, encodeBase64 } from "@/libs/base64";

export default function Page({ params: { id } }: { params: { id: string } }) {
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "image" });
	const { data: dataset, isPending: datasetPending } = useGetDataset(id);
	const { data: image, isPending: imagePending } = useGetSurroundingImages(
		id,
		decodeBase64(getQueryParam()) || "",
		{
			enabled: !!getQueryParam(),
		},
	);
	console.log(image);
	return (
		<BaseSkeleton
			loading={datasetPending || imagePending || !image?.current?.url}
		>
			<AnnotationSection
				type={dataset?.annotationMethod || ""}
				image={image?.current?.url || ""}
				length={dataset?.imageCount || 0}
				name={decodeURIComponent(image?.current?.path || "")}
				onUpdate={(data) => {}}
				disabled={[!image?.prev?.path, !image?.next?.path]}
				onPrevious={() =>
					image &&
					setQueryParam({ params: { image: encodeBase64(image?.prev?.path) } })
				}
				onNext={() =>
					image &&
					setQueryParam({ params: { image: encodeBase64(image?.next?.path) } })
				}
			/>
		</BaseSkeleton>
	);
}
