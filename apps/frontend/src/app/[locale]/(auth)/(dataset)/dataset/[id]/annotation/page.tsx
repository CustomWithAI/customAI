"use client";
import { BaseSkeleton } from "@/components/specific/skeleton";
import AnnotationSection from "@/features/canvas/annotation";
import {
	useUpdateDataset,
	useUpdateImage,
} from "@/hooks/mutations/dataset-api";
import {
	useGetDataset,
	useGetSurroundingImages,
} from "@/hooks/queries/dataset-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { useRouter } from "@/libs/i18nNavigation";
import {
	formatToAnnotate,
	formatToEditor,
	formatToLabels,
} from "@/utils/formatEditor";
import { isSameUnorderedArray } from "@/utils/isSameArray";
import { useMemo } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
	const router = useRouter();
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "image" });
	const {
		data: dataset,
		isPending: datasetPending,
		refetch: fetchDataset,
	} = useGetDataset(id);
	const {
		data: image,
		isPending: imagePending,
		refetch: fetchNewImage,
	} = useGetSurroundingImages(id, decodeBase64(getQueryParam()) || "", {
		enabled: !!getQueryParam(),
	});

	const { mutateAsync: updateImage } = useUpdateImage();
	const { mutateAsync: updateDataset } = useUpdateDataset();

	const memoizedDefaultValue = useMemo(() => {
		if (!image?.current?.annotation || !dataset?.labels) return undefined;
		return formatToEditor(image.current.annotation, dataset.labels);
	}, [image?.current?.annotation, dataset?.labels]);

	return (
		<BaseSkeleton
			loading={datasetPending || imagePending || !image?.current?.url}
		>
			<AnnotationSection
				type={dataset?.annotationMethod || ""}
				image={image?.current?.url || ""}
				length={dataset?.imageCount || 0}
				name={decodeURIComponent(image?.current?.path || "")}
				mode={dataset?.annotationMethod || ""}
				defaultValue={memoizedDefaultValue}
				onUpdate={async (data, isClose) => {
					if (!id || !getQueryParam()) return;

					const labels = data.labels?.map((label) => {
						const { id, ...rest } = label;
						return rest;
					});

					await updateImage({
						id,
						imagesPath: decodeBase64(getQueryParam()) || "",
						data: { annotation: formatToAnnotate(data) },
					});
					if (!isSameUnorderedArray(dataset?.labels || [], labels)) {
						await updateDataset({
							id,
							data: {
								labels: data.labels.map((label) => {
									const { id, ...rest } = label;
									return rest;
								}),
							},
						});
						fetchDataset();
					}
					if (isClose) {
						router.push(`/dataset/${id}`);
					}
					return;
				}}
				isLoading={imagePending || datasetPending}
				disabled={[!image?.prev?.path, !image?.next?.path]}
				onPrevious={() => {
					if (image) {
						setQueryParam({
							params: { image: encodeBase64(image?.prev?.path) },
						});
						fetchNewImage();
						return formatToEditor(image?.current.annotation, dataset?.labels);
					}
					return undefined;
				}}
				onNext={() => {
					if (image) {
						setQueryParam({
							params: { image: encodeBase64(image?.next?.path) },
						});
						fetchNewImage();
						return formatToEditor(image?.current.annotation, dataset?.labels);
					}
					return undefined;
				}}
			/>
		</BaseSkeleton>
	);
}
