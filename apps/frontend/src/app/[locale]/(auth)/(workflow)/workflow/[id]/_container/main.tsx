import { ActivityBox } from "@/components/specific/activityBox";
import { OverviewBox } from "@/components/specific/panelBox";
import {
	Content,
	Header,
	Quote,
	SubHeader,
	Subtle,
} from "@/components/typography/text";
import { DotBadge } from "@/components/ui/dot-badge";
import { Layers2, PackagePlus, ScanSearch, Tractor } from "lucide-react";

export const MainWorkflowPage = () => {
	return (
		<>
			<Header>workflow name</Header>
			<div className="grid md:grid-cols-4 max-md:grid-cols-1 max-lg:gap-6 lg:gap-8">
				<div className="col-span-1 md:col-span-3">
					<Subtle className="font-medium mt-2">Overview Panel</Subtle>
					<div className="mt-3 w-full grid grid-cols-3 max-sm:grid-cols-1 gap-4">
						<OverviewBox
							title="Create a model"
							description="To create your own pipeline."
							icon={<PackagePlus />}
						/>
						<OverviewBox
							title="Create a model"
							description="To create your own pipeline."
							icon={<PackagePlus />}
						/>
						<OverviewBox
							title="Create a model"
							description="To create your own pipeline."
							icon={<PackagePlus />}
						/>
					</div>
					<Content className="font-semibold mt-6 mb-3">
						Training History Chart
					</Content>
					<div className="w-full h-96 bg-zinc-200 rounded-md"> </div>
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
					<Quote className="text-zinc-700 my-5">
						No description, website, or topics provided.
					</Quote>
					<div className="space-y-3 text-zinc-700 pb-6 border-b">
						<div className="flex space-x-4">
							<Layers2 className="w-6 h-6" />
							<Content>Pre-trained : Yolo12</Content>
						</div>
						<div className="flex space-x-4">
							<ScanSearch className="w-6 h-6" />
							<Content>Object Detection</Content>
						</div>
					</div>
					<div className="flex mt-6 mb-3">
						<SubHeader>Versions</SubHeader>
					</div>
					<div className="space-y-3 text-zinc-700 pb-6 border-b">
						<div className="relative flex space-x-4">
							<Tractor className="absolute top-6 w-6 h-6" />
							<div className="pl-5 space-y-2">
								<DotBadge className="text-[0.7rem]" variant="success">
									Ready to use
								</DotBadge>
								<div className="flex items-baseline space-x-2">
									<Content className="font-semibold leading-none">2.1</Content>
									<Subtle className="leading-none">2 month ago</Subtle>
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
