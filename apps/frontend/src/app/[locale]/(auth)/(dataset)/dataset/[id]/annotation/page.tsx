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

export default function Page({ params: { id } }: { params: { id: string } }) {
	const router = useRouter();
	const { getQueryParam, setQueryParam } = useQueryParam({ name: "image" });
	const { data: dataset, isPending: datasetPending } = useGetDataset(id);
	const { data: image, isPending: imagePending } = useGetSurroundingImages(
		id,
		decodeBase64(getQueryParam()) || "",
		{
			enabled: !!getQueryParam(),
		},
	);

	const { mutateAsync: updateImage } = useUpdateImage();
	const { mutateAsync: updateDataset } = useUpdateDataset();

	return (
		<BaseSkeleton
			loading={datasetPending || imagePending || !image?.current?.url}
		>
			<AnnotationSection
				type={dataset?.annotationMethod || ""}
				image={image?.current?.url || ""}
				length={dataset?.imageCount || 0}
				name={decodeURIComponent(image?.current?.path || "")}
				defaultValue={{
					labels: formatToLabels(dataset?.labels),
					...formatToEditor(image?.current.annotation),
				}}
				onUpdate={async (data) => {
					await updateImage({
						id,
						imagesPath: decodeBase64(getQueryParam()) || "",
						data: { annotation: formatToAnnotate(data) },
					});
					if ((dataset?.labels?.length || 0) !== (data.labels?.length || 0)) {
						await updateDataset({
							id,
							data: {
								labels: data.labels?.map((label) => label.name),
							},
						});
					}
					router.push(`/dataset/${id}`);
				}}
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
