import { Content, ContentHeader, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFileMeta } from "@/lib/getFileUrl";
import { encodeBase64 } from "@/libs/base64";
import { useRouter } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import type { TrainingModel } from "@/types/response/training";
import { diffObjects } from "@/utils/diffVersion";
import { formatDistanceToNow } from "date-fns";
import {
	Edit2,
	Ellipsis,
	GitCommitVertical,
	Link,
	Router,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { DiffDisplay } from "./diffDisplay";

const formatSize = (bytes: number | string): string => {
	const numberBytes = Number(bytes);
	if (numberBytes >= 1024 ** 4)
		return `${(numberBytes / 1024 ** 4).toFixed(2)} TB`;
	if (numberBytes >= 1024 ** 3)
		return `${(numberBytes / 1024 ** 3).toFixed(2)} GB`;
	if (numberBytes >= 1024 ** 2)
		return `${(numberBytes / 1024 ** 2).toFixed(2)} MB`;
	if (numberBytes >= 1024) return `${(numberBytes / 1024).toFixed(2)} kB`;
	return `${bytes} B`;
};

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
	const [show, setShow] = useState<boolean>(false);
	const [meta, setMeta] = useState<Awaited<
		ReturnType<typeof getFileMeta>
	> | null>(null);
	const t = useTranslations();
	const router = useRouter();

	const { ref, inView } = useInView({
		triggerOnce: false,
		threshold: 0.1,
	});

	useEffect(() => {
		if (inView) {
			onInView(current.version);
		}
	}, [inView, current.version, onInView]);

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
		["id", "createdAt", "updatedAt", "priority", "name", "userId"],
	);

	useEffect(() => {
		void (async () => {
			const fileMeta = await getFileMeta(current?.trainedModelPath);
			setMeta(fileMeta);
		})();
	}, [current?.trainedModelPath]);

	const Icon = meta?.icon;
	return (
		<div ref={ref} id={current.version} className="flex w-full pb-4">
			<GitCommitVertical />
			<div className="space-y-1.5 flex-1">
				<div className="flex items-center w-full space-x-2">
					<ContentHeader>{current.version}</ContentHeader>
					{current.isDefault && <Badge variant="secondary">default</Badge>}
				</div>
				<div className="rounded-lg flex-1 w-full shadow-md border border-gray-200 relative px-6 py-5">
					<div className="flex max-md:flex-col grow md:items-end gap-x-4 mb-4">
						<ContentHeader>{current.id}</ContentHeader>
						<Subtle className="mb-0.5">
							{formatDistanceToNow(new Date(current.createdAt), {
								addSuffix: true,
							})}
						</Subtle>
					</div>
					<div className=" absolute right-4 top-4 z-99 bg-white/40 group-hover:bg-white duration-100 rounded-sm p-1 flex items-center gap-1 ml-auto">
						<Button
							variant="ghost"
							size="sm"
							className="hover:bg-zinc-100/80 h-6 w-6 p-0"
							onClick={(e) => {
								e.stopPropagation();
								router.push(
									`/workflow/create?step=${encodeBase64(current.pipeline.steps?.find((s) => s.index === 0)?.name || "workflow_info")}&id=${encodeBase64(current?.workflow?.id)}&trainings=${encodeBase64(current?.id)}`,
								);
							}}
						>
							<Edit2 className="w-4 h-4 text-black" />
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="hover:bg-zinc-100/80 h-6 w-6 p-0"
									onClick={(e) => {
										e.stopPropagation();
									}}
								>
									<Ellipsis className="w-4 h-4 text-black" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuItem>set default</DropdownMenuItem>
								<DropdownMenuItem className="text-red-500">
									remove
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<Content className="font-medium mb-1">change info</Content>
					<div className={cn("flex flex-col mb-3")}>
						<DiffDisplay data={show ? diffVersion : diffVersion?.slice(0, 5)} />
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
					{meta && (
						<div className="mt-3">
							<Content className="font-medium mb-1">files</Content>
							<div className="px-5 py-1 rounded flex space-x-2 justify-between">
								<div className="inline-flex space-x-3">
									{Icon && <Icon className="w-4 h-4" />}
									<Content className="text-blue-600 font-semibold">
										{meta.name}
									</Content>
									<Content className="text-blue-600">
										({meta.extension})
									</Content>
								</div>
								<Content>
									{meta.size ? formatSize(meta.size) : "unknown"}
								</Content>
							</div>
						</div>
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
