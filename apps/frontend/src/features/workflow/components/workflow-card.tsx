import { ContentHeader, Subtle } from "@/components/typography/text";
import { cn } from "@/libs/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

type WorkflowCardProps = {
	name: string;
	description: string;
	imageUrl: string;
	current: boolean;
	onClick: (type: string) => void;
	tags: string[];
};
export const WorkflowCard = memo(
	({
		name,
		description,
		onClick,
		imageUrl,
		tags,
		current,
	}: WorkflowCardProps) => (
		<button
			type="button"
			onClick={() => onClick(name)}
			className={cn(
				"relative hover:shadow-blue-500 border-transparent duration-200 hover:shadow-xs text-start shadow-md min-h-96 flex flex-col m-px rounded-lg p-6 border w-full max-w-xs space-y-4",
				{ "border-green-500": current },
			)}
		>
			<div className="space-y-0.5 h-16 flex flex-col align-text-top">
				<ContentHeader>{name}</ContentHeader>
				<Subtle className="">{description}</Subtle>
			</div>
			{imageUrl ? (
				<Image
					src={imageUrl}
					alt={`${name}-image`}
					layout="responsive"
					width={16}
					height={9}
					className="rounded-md"
				/>
			) : (
				<div
					className={cn(
						"flex flex-1 w-full h-28 min-h-[6rem] aspect-video rounded-xl [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black",
						"[background-size:20px_20px]",
						"[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
						"dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
					)}
				/>
			)}
			<div className="space-y-2">
				<Subtle>tags</Subtle>
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<div
							key={`tags-${tag}`}
							className="rounded-xs bg-gray-100 text-gray-400 px-2 text-sm"
						>
							# {tag}
						</div>
					))}
				</div>
			</div>
		</button>
	),
);
