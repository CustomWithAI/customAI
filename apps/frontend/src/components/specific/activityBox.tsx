import { formatDistanceToNow } from "date-fns";
import { Cpu } from "lucide-react";
import type { ReactNode } from "react";
import { Content, Subtle } from "../typography/text";

type ActivityStatus = "create" | "edit" | "update" | "delete";

type ActivityBoxProps = {
	title: string;
	time: Date | number | string;
	status: ActivityStatus;
	avatarImg?: string;
};

export const ActivityBox = ({
	title,
	time = new Date(),
	status,
	avatarImg,
}: ActivityBoxProps) => {
	const activityIconMap: Record<ActivityStatus, ReactNode> = {
		create: <Cpu />,
		edit: "",
		update: "",
		delete: "",
	};
	return (
		<div className="space-y-3 mb-4">
			<div className="flex space-x-4">
				{activityIconMap[status]}
				<div className="flex items-baseline space-x-2">
					<Content>{title}</Content>
					<div className="relative h-2.5 w-1 flex items-center">
						<span className="absolute top-1/2 transform -translate-y-1/2 w-1 h-1 bg-zinc-700 rounded-full" />
					</div>
					<Subtle>{formatDistanceToNow(time, { addSuffix: true })}</Subtle>
				</div>
			</div>
			<div className="border-l border-gray-200 ml-2.5">
				<div className="pb-4 ml-7">a</div>
			</div>
		</div>
	);
};
