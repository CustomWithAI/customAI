import { DialogBuilder } from "@/components/builder/dialog";
import { BaseSkeleton } from "@/components/specific/skeleton";
import {
	Content,
	Header,
	SubHeader,
	Subtle,
} from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import {
	SplitMethod,
	type SplitMethodRef,
} from "@/features/dataset/section/splitMethod";
import {
	RatioCalculator,
	type RatioCalculatorRef,
} from "@/features/dataset/section/trainTestRatio";
import {
	useDeleteDataset,
	useUpdateDataset,
} from "@/hooks/mutations/dataset-api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/libs/i18nNavigation";
import type { ResponseDataset } from "@/types/response/dataset";
import { Router, Settings2 } from "lucide-react";
import { useCallback, useRef } from "react";

export default function DatasetManagement({
	dataset,
}: { dataset: ResponseDataset | undefined }) {
	const { toast } = useToast();
	const router = useRouter();
	const splitMethodRef = useRef<SplitMethodRef>(null);
	const ratioRef = useRef<RatioCalculatorRef>(null);
	const { mutateAsync: updateDataset, isPending: datasetPending } =
		useUpdateDataset();
	const { mutate: deleteDataset } = useDeleteDataset();

	const handleSubmit = useCallback(async () => {
		if (!ratioRef.current?.data || !splitMethodRef.current?.data) return;
		const [train, test, valid] = ratioRef.current.data;
		const data = {
			splitMethod: splitMethodRef.current.data,
			test,
			train,
			valid,
		};
		if (!dataset) {
			toast({ title: "dataset is not found", variant: "destructive" });
			return;
		}
		await updateDataset(
			{ id: dataset?.id, data: data },
			{
				onSuccess: (t) => {
					toast({ title: "update dataset successfully" });
				},
				onError: (e) => {
					toast({
						title: `update failed: ${e.message}`,
						variant: "destructive",
					});
				},
			},
		);
	}, [dataset, toast, updateDataset]);

	const handleReset = useCallback(() => {
		ratioRef.current?.reset();
		splitMethodRef.current?.reset();
	}, []);

	return (
		<BaseSkeleton loading={!dataset}>
			<Header className="inline-flex items-center gap-x-2">
				<Settings2 /> Dataset Management
			</Header>
			<div className="space-y-6">
				<div className=" w-full pb-2">
					<div className="border-b border-gray-200 w-full pb-2">
						<SubHeader className=" font-medium leading-8">
							Train/Test Split
						</SubHeader>
						<Subtle>Rebalance test/train split image dataset</Subtle>
					</div>
					<div className="max-w-xs mt-6 ml-6">
						<SplitMethod
							ref={splitMethodRef}
							defaultValue={dataset?.splitMethod || ""}
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
					<div className="flex space-x-4 pb-4">
						<Button disabled={datasetPending} onClick={handleSubmit}>
							update
						</Button>
						<Button variant="secondary" onClick={handleReset}>
							cancel
						</Button>
					</div>
				</div>

				<div className="border-b border-gray-200 w-full pb-2">
					<SubHeader className="font-medium leading-8">
						General Settings
					</SubHeader>
				</div>
				<div className="ml-6">
					<Subtle className="mb-3">delete dataset and all images</Subtle>
					<DialogBuilder
						config={{
							trigger: (
								<Button
									variant="outline"
									className="text-red-500 border-red-500 hover:text-red-800"
								>
									delete dataset
								</Button>
							),
							title: "are you want to delete this dataset",
							description: "remove those image and dataset permanently",
							onConfirm: () =>
								deleteDataset(
									{ id: dataset?.id || "" },
									{
										onSuccess: () => {
											toast({ title: "delete dataset successfully" });
											router.push("/dataset");
										},
									},
								),
						}}
					/>
				</div>
			</div>
		</BaseSkeleton>
	);
}
