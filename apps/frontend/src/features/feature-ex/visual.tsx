import { Content } from "@/components/typography/text";
import { node } from "@/configs/feat-extract";
import CustomNode from "@/features/blueprint/node-template/preprocessing";
import { VisualSection } from "@/features/blueprint/visual-section";
import { useGetImages } from "@/hooks/queries/dataset-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64 } from "@/libs/base64";
import { jsonToParams } from "@/utils/Json-to-params";
import { Suspense } from "react";

export const VisualFeatureExSection = () => {
	const { getQueryParam } = useQueryParam();
	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);

	const { data: training } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
	);
	const { data: images } = useGetImages(
		training?.data.dataset?.id || "",
		{
			enabled: !!training?.data.dataset?.id,
		},
		jsonToParams({ limit: 1 }),
	);
	return (
		<Suspense fallback={<Content>loading..</Content>}>
			<VisualSection
				node={node}
				image={images?.data.at(0)?.url || ""}
				customNode={CustomNode}
			/>
		</Suspense>
	);
};
