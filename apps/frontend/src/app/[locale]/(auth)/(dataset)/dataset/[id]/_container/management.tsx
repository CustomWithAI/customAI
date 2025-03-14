import { BaseSkeleton } from "@/components/specific/skeleton";
import { Header, SubHeader, Subtle } from "@/components/typography/text";
import { SplitMethod } from "@/features/dataset/section/splitMethod";
import type { ResponseDataset } from "@/types/response/dataset";
import { Settings2 } from "lucide-react";

export default function DatasetManagement({
	dataset,
}: { dataset: ResponseDataset | undefined }) {
	return (
		<BaseSkeleton loading={!dataset}>
			<Header className=" inline-flex items-center gap-x-2">
				<Settings2 /> Dataset Management
			</Header>
			<div className="space-y-6">
				<div className="border-b w-full pb-2">
					<SubHeader className="font-medium leading-8">
						Train/Test Split
					</SubHeader>
					<Subtle>Rebalance test/train split image dataset</Subtle>
					<div className="max-w-xs mt-6 ml-6">
						<SplitMethod
							id={dataset?.id || ""}
							value={dataset?.split_method || ""}
						/>
					</div>
				</div>
				<div className="border-b w-full pb-2">
					<SubHeader className="font-medium leading-8">Annotation</SubHeader>
					<Subtle>Tagging images to prepare them for model training</Subtle>
				</div>
			</div>
		</BaseSkeleton>
	);
}
