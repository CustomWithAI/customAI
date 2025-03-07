import { Header, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import type { WorkflowModel } from "@/types/response/workflow";
import { useFormatter } from "next-intl";

type CardProps = WorkflowModel & {
	href?: string;
	onClick?: () => void;
	className?: string;
};

export const WorkflowCard: React.FC<CardProps> = ({
	name,
	description,
	type,
	href = "",
	onClick,
	className,
	createdAt,
}) => {
	const router = useRouter();
	const { relativeTime } = useFormatter();
	return (
		<button
			type="button"
			className={cn(
				"relative min-w-64 hover:shadow-blue-500 hover:shadow-sm duration-200 border",
				" rounded-lg shadow-md overflow-hidden",
				className,
			)}
			onClick={() => {
				href && router.push(href);
				onClick?.();
			}}
		>
			<div className="w-full text-left p-6 min-h-32 bg-white z-10">
				<Header className="font-semibold text-lg">{name}</Header>
				<Badge className="text-xs text-gray-500" variant="secondary">
					{type}
				</Badge>
			</div>

			<div className="absolute bottom-4 right-4 text-xs text-gray-300 font-light">
				{relativeTime(new Date(createdAt))}
			</div>
		</button>
	);
};
