import { Header } from "@/components/typography/text";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/libs/utils";
import {
	BrainCog,
	Code2,
	Layers,
	LineChart,
	Settings2,
	SlidersHorizontal,
} from "lucide-react";

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
			title: "Modular Workflow Design",
			description:
				"Define and rearrange each step in the AI training pipeline—data prep, training, evaluation, and deployment.",
			header: <Skeleton />,
			icon: <Layers className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-2",
		},
		{
			title: "Custom Model Architectures",
			description:
				"Build or import your own neural network models and integrate seamlessly into the training flow.",
			header: <Skeleton />,
			icon: <BrainCog className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-1",
		},
		{
			title: "Hyperparameter Tuning",
			description:
				"Manually set or auto-optimize learning rate, batch size, and other parameters at each stage.",
			header: <Skeleton />,
			icon: <SlidersHorizontal className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-1",
		},
		{
			title: "Pipeline Scripting",
			description:
				"Write custom scripts and logic to control process decisions dynamically across the training loop.",
			header: <Skeleton />,
			icon: <Code2 className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-1",
		},
		{
			title: "Real-Time Monitoring",
			description:
				"Get live metrics, logs, and visual feedback during training and evaluation.",
			header: <Skeleton />,
			icon: <LineChart className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-1",
		},
		{
			title: "Full Configurability",
			description:
				"Every component—from preprocessing to post-training actions—can be overridden or extended.",
			header: <Skeleton />,
			icon: <Settings2 className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-2",
		},
	];

	return (
		<div className="bg-white">
			<Header className="my-4 mt-12 font-bold w-full flex justify-center">
				Key Features
			</Header>
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
