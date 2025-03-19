import { BaseSkeleton } from "@/components/specific/skeleton";
import { Header, SubHeader, Subtle } from "@/components/typography/text";
import {
	SplitMethod,
	type SplitMethodRef,
} from "@/features/dataset/section/splitMethod";
import {
	RatioCalculator,
	type RatioCalculatorRef,
} from "@/features/dataset/section/trainTestRatio";
import type { ResponseDataset } from "@/types/response/dataset";
import { Settings2 } from "lucide-react";
import { useCallback, useRef } from "react";

export default function DatasetManagement({
	dataset,
}: { dataset: ResponseDataset | undefined }) {
	const splitMethodRef = useRef<SplitMethodRef>(null);
	const ratioRef = useRef<RatioCalculatorRef>(null);

	const handleSubmit = useCallback(async () => {
		if (!ratioRef.current?.data || !splitMethodRef.current?.data) return;
		const [test, train, valid] = ratioRef.current.data;
		const data = {
			splitMethod: splitMethodRef.current.data,
			test,
			train,
			valid,
		};
	}, []);

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
							ref={splitMethodRef}
							defaultValue={dataset?.split_method || ""}
						/>
					</div>
					<div className="mt-6 ml-6">
						<RatioCalculator
							ref={ratioRef}
							defaultValue={[
								dataset?.train || 0,
								dataset?.test || 0,
								dataset?.valid || 0,
							]}
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
