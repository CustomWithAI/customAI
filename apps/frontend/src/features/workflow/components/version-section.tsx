import { Content, ContentHeader, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import type { TrainingModel } from "@/types/response/training";
import { diffObjects } from "@/utils/diffVersion";
import { formatDistanceToNow } from "date-fns";
import { GitCommitVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { DiffDisplay } from "./diffDisplay";

export type VersionSectionProps = {
	current: TrainingModel;
	prev?: TrainingModel;
	onInView: (version: string) => void;
};

export const VersionSection = ({
	current,
	prev,
	onInView,
}: VersionSectionProps) => {
	const { ref, inView } = useInView({
		triggerOnce: false,
		threshold: 0.5,
	});

	useEffect(() => {
		if (inView) {
			onInView(current.version);
		}
	}, [inView, current.version, onInView]);

	const [show, setShow] = useState<boolean>(false);
	const diffVersion = diffObjects(
		prev,
		current,
		[
			"augmentation",
			"customModel",
			"featureExtraction",
			"imagePreprocessing",
			"machineLearningModel",
			"preTrainedModel",
		],
		["id", "createdAt", "updatedAt", "priority", "name"],
	);
	const t = useTranslations();
	return (
		<div ref={ref} id={current.version} className="flex w-full">
			<GitCommitVertical />
			<div className="space-y-1.5 flex-1">
				<div className="flex items-center w-full space-x-2">
					<ContentHeader>{current.version}</ContentHeader>
					{current.isDefault && <Badge variant="secondary">default</Badge>}
				</div>
				<div className="rounded-lg flex-1 w-full shadow-md border border-gray-200 relative px-6 py-5">
					<div className="flex grow items-end gap-x-4 mb-4">
						<ContentHeader>{current.id}</ContentHeader>
						<Subtle className="mb-0.5">
							{formatDistanceToNow(new Date(current.createdAt), {
								addSuffix: true,
							})}
						</Subtle>
					</div>
					<Content className="font-medium mb-1">change info</Content>
					<div className={cn("flex flex-col mb-3")}>
						<DiffDisplay
							data={show ? diffVersion : diffVersion?.splice(0, 5)}
						/>
					</div>
					{diffVersion?.length > 5 && (
						<button
							type="button"
							onClick={() => setShow((p) => !p)}
							className="font-semibold text-xs text-zinc-600 underline hover:text-blue-500 duration-200"
						>
							show more..
						</button>
					)}
					<div className="w-full my-4 border-b border-gray-200" />
					<Content className="font-medium mb-2">Contributor</Content>
					<div className="flex items-center space-x-4">
						<div className="relative max-w-16 max-h-16 aspect-square">
							<div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
								<span className="text-gray-500">{t("Account.ProfileImg")}</span>
							</div>
						</div>
						<Content className="text-blue-600">{current.workflow.name}</Content>
					</div>
				</div>
			</div>
		</div>
	);
};
