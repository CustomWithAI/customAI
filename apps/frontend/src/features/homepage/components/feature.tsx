import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/libs/utils";
import {
	IconClipboardCopy,
	IconFileBroken,
	IconSignature,
	IconTableColumn,
} from "@tabler/icons-react";

export const FeatureBento = () => {
	const Skeleton = () => (
		<div
			className={cn(
				"flex flex-1 w-full h-full min-h-[6rem] rounded-xl [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black",
				"[background-size:20px_20px]",
				"[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
				"dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
			)}
		/>
	);
	const items = [
		{
			title: "The Dawn of Innovation",
			description: "Explore the birth of groundbreaking ideas and inventions.",
			header: <Skeleton />,
			className: "md:col-span-2",
			icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
		},
		{
			title: "The Digital Revolution",
			description: "Dive into the transformative power of technology.",
			header: <Skeleton />,
			className: "md:col-span-1",
			icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
		},
		{
			title: "The Art of Design",
			description: "Discover the beauty of thoughtful and functional design.",
			header: <Skeleton />,
			className: "md:col-span-1",
			icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
		},
		{
			title: "The Power of Communication",
			description:
				"Understand the impact of effective communication in our lives.",
			header: <Skeleton />,
			className: "md:col-span-2",
			icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
		},
	];

	return (
		<div className="bg-white">
			<BentoGrid className="mx-auto max-w-(--breakpoint-2xl) md:auto-rows-[20rem] p-6 lg:p-10 backdrop-blur-xs">
				{items.map((item, i) => (
					<BentoGridItem
						key={`${item.title}-HomePage`}
						title={item.title}
						description={item.description}
						header={item.header}
						className={item.className}
						icon={item.icon}
					/>
				))}
			</BentoGrid>
		</div>
	);
};
