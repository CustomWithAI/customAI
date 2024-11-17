"use client";
import { SingleBeam } from "@/components/common/single-beam";
import { HomeMenu } from "@/components/layout/homeMenu";
import { Primary, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/filp-words";
import {
	IconClipboardCopy,
	IconFileBroken,
	IconSignature,
	IconTableColumn,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function Home() {
	return (
		<Suspense fallback={<div>a</div>}>
			<HomePage />
		</Suspense>
	);
}
function HomePage() {
	const t = useTranslations("HomePage");

	const Skeleton = () => (
		<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black" />
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
		<div className="min-h-full w-full">
			<HomeMenu />
			<div className=" h-[40rem] top-0 z-0 w-full dark:bg-black bg-white  dark:bg-grid-white/[0.03] bg-grid-black/[0.03] relative flex items-center justify-center">
				<div className="flex flex-1 flex-col gap-4 px-8 w-full max-w-screen-2xl mx-auto h-screen lg:h-3/4 justify-center">
					<div className="w-3/5 pr-6 space-y-4">
						<Badge
							className="bg-yellow-300 text-yellow-900"
							variant="secondary"
						>
							AI Platform
						</Badge>
						<Primary className="mt-4">
							Create AI models to your preferences with our simple{" "}
							<FlipWords
								className="-ml-1"
								words={["tools", "features", "interface"]}
							/>
						</Primary>
						<Subtle>Make AI models to match your specific needs</Subtle>
						<Button className="mt-8">Get a demo</Button>
					</div>
				</div>
			</div>
			<div className="bg-white">
				<BentoGrid className="mx-auto max-w-screen-2xl md:auto-rows-[20rem] bg-black/5 p-6 lg:p-10 shadow-md backdrop-blur-sm border-x">
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
		</div>
	);
}
