import { ContentHeader, Subtle } from "@/components/typography/text";
import Image from "next/image";
import { memo } from "react";

type WorkflowCardProps = {
	name: string;
	description: string;
	imageUrl: string;
	onClick: (type: string) => void;
	tags: string[];
};
export const WorkflowCard = memo(
	({ name, description, onClick, imageUrl, tags }: WorkflowCardProps) => (
		<button
			type="button"
			onClick={() => onClick(name)}
			className="hover:bg-zinc-50 text-start shadow-md rounded-lg p-6 border max-w-sm space-y-4"
		>
			<div className="space-y-0.5">
				<ContentHeader>{name}</ContentHeader>
				<Subtle>{description}</Subtle>
			</div>
			<Image
				src={imageUrl}
				alt={`${name}-image`}
				layout="responsive"
				width={16}
				height={9}
				className="rounded-md"
			/>
			<div className="space-y-2">
				<Subtle>tags</Subtle>
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<div
							key={`tags-${tag}`}
							className="rounded-sm bg-gray-100 text-gray-400 px-2 text-sm"
						>
							# {tag}
						</div>
					))}
				</div>
			</div>
		</button>
	),
);
