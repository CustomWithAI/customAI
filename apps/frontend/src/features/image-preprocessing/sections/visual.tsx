import { Content } from "@/components/typography/text";
import { node } from "@/configs/image-preprocessing";
import CustomNode from "@/features/blueprint/node";
import { VisualSection } from "@/features/blueprint/visual-section";
import { Suspense } from "react";

export const VisualPreprocessingSection = () => {
	return (
		<Suspense fallback={<Content>loading..</Content>}>
			<VisualSection node={node} customNode={CustomNode} />
		</Suspense>
	);
};
