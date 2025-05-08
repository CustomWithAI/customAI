import { RenderStatusAlert } from "@/components/common/alertStatus";
import { ActivityBox } from "@/components/specific/activityBox";
import { OverviewBox } from "@/components/specific/panelBox";
import {
	Content,
	Header,
	Quote,
	SubHeader,
	Subtle,
} from "@/components/typography/text";
import { DotBadge, type VariantProps } from "@/components/ui/dot-badge";
import { ModelEvaluationDashboard } from "@/features/workflow/components/modelEvaluationDashboard";
import { encodeBase64 } from "@/libs/base64";
import type { TrainingModel } from "@/types/response/training";
import type { WorkflowModel } from "@/types/response/workflow";
import { toCapital } from "@/utils/toCapital";
import {
	Archive,
	Group,
	Layers2,
	PackagePlus,
	ScanSearch,
	Tractor,
} from "lucide-react";
import { useFormatter } from "next-intl";

const STATUS_COLOR: Record<string, VariantProps> = {
	created: "warning",
	pending: "warning",
	prepare_dataset: "warning",
	training: "warning",
	completed: "success",
	failed: "danger",
};

const STATUS: Record<string, string> = {
	created: "Created",
	pending: "In queue",
	prepare_dataset: "Prepare data",
	training: "Training",
	completed: "Ready to use",
	failed: "Failed",
};

export const MainWorkflowPage = ({
	data,
	default: mainDefault,
	default_status,
}: {
	data: WorkflowModel | undefined;
	default: TrainingModel | undefined;
	default_status: boolean;
}) => {
	const { relativeTime } = useFormatter();

	const modelFormat =
		mainDefault?.customModel ||
		mainDefault?.preTrainedModel ||
		mainDefault?.machineLearningModel
			? `${
					mainDefault?.customModel
						? "Custom-train"
						: mainDefault?.preTrainedModel
							? "Pre-train"
							: mainDefault?.machineLearningModel
								? "ML-train"
								: "unknown"
				}
  ${
		mainDefault?.preTrainedModel || mainDefault?.machineLearningModel
			? ": "
			: ""
	}
  ${
		mainDefault?.preTrainedModel ||
		mainDefault?.machineLearningModel?.type ||
		"unknown"
	}`
			: "none";

	return (
		<>
			<Header>{data?.name}</Header>
			<div className="grid md:grid-cols-4 max-md:grid-cols-1 max-lg:gap-6 lg:gap-8">
				<div className="col-span-1 md:col-span-3">
					<Subtle className="font-medium mt-2">Overview Panel</Subtle>
					<div className="mt-3 w-full grid grid-cols-3 max-sm:grid-cols-1 gap-4">
						<OverviewBox
							title="Create a new training"
							description="To create new pipeline training."
							icon={<PackagePlus />}
							disabled={!data?.id}
							href={`create/?step=cHJlc2V0&id=${encodeBase64(data?.id || "")}`}
						/>
						<OverviewBox
							title="use a model"
							description="To use your trained pipeline."
							icon={<Group />}
							href={`/use/?workflowId=${encodeBase64(data?.id || "")}`}
						/>
						<OverviewBox
							title="evaluate a model"
							description="To analysis data in last training."
							icon={<Archive />}
							href={`?tab=insights&id=${encodeBase64(mainDefault?.id || "")}`}
						/>
					</div>
					<Content className="font-semibold mt-6 mb-3">
						Training Default Chart
					</Content>
					<div className="w-full min-h-96 mb-10 rounded-md">
						{mainDefault?.evaluation ? (
							<ModelEvaluationDashboard initialData={mainDefault?.evaluation} />
						) : (
							<RenderStatusAlert status={default_status}>
								<div className="flex border rounded-xl border-gray-200 border-dashed text-gray-400 justify-center items-center w-full h-96">
									no evaluation result found
								</div>
							</RenderStatusAlert>
						)}
					</div>
					<Content className="font-semibold mt-6 mb-4">Activity logs</Content>
					<ActivityBox
						title="train a model"
						time={new Date()}
						status="create"
					/>
					<ActivityBox
						title="train a model"
						time={new Date()}
						status="create"
					/>
					<Subtle className="font-semibold hover:cursor-pointer text-blue-700 hover:text-blue-900 duration-150 hover:underline">
						view all activity logs
					</Subtle>
				</div>
				<div>
					<SubHeader>About</SubHeader>
					<Quote className="text-zinc-700 my-5">{data?.description}</Quote>
					<div className="space-y-3 text-zinc-700 pb-6 border-b border-gray-200">
						<div className="flex space-x-4">
							<Layers2 className="w-6 h-6" />
							<Content>{modelFormat}</Content>
						</div>
						<div className="flex space-x-4">
							<ScanSearch className="w-6 h-6" />
							<Content>{toCapital(data?.type || "")}</Content>
						</div>
					</div>
					<div className="flex mt-6 mb-3">
						<SubHeader>Versions</SubHeader>
					</div>
					<div className="space-y-3 text-zinc-700 pb-6 border-b border-gray-200">
						<div className="relative flex space-x-4">
							<Tractor className="absolute top-6 w-6 h-6" />
							<div className="pl-5 space-y-2">
								<DotBadge
									className="text-[0.7rem]"
									variant={STATUS_COLOR[mainDefault?.status || ""] || "warning"}
								>
									{STATUS[mainDefault?.status || ""] || "unknown"}
								</DotBadge>
								<div className="flex items-baseline space-x-2 ml-2">
									<Content className="font-semibold leading-none">
										{mainDefault?.version}
									</Content>
									<Subtle className="leading-none">
										{relativeTime(new Date(mainDefault?.createdAt || ""))}
									</Subtle>
								</div>
							</div>
						</div>
					</div>
					<div className="flex mt-6 mb-3">
						<SubHeader>Members</SubHeader>
					</div>
				</div>
			</div>
		</>
	);
};
