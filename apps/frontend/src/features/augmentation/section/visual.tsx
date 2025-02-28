import { Content } from "@/components/typography/text";
import { node } from "@/configs/augmentation";
import CustomNode from "@/features/blueprint/node-template/augmentation";
import { VisualSection } from "@/features/blueprint/visual-section";
import { Suspense } from "react";

export const VisualAugmentationSection = () => {
	return (
		<Suspense fallback={<Content>loading..</Content>}>
			<VisualSection node={node} customNode={CustomNode} />
		</Suspense>
	);
};
