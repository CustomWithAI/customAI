import { SingleBeam } from "@/components/common/single-beam";
import { Primary, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/filp-words";
import { cn } from "@/libs/utils";
import { motion } from "framer-motion";

function ElegantShape({
	className,
	delay = 0,
	width = 400,
	height = 100,
	rotate = 0,
	gradient = "from-white/[0.08]",
}: {
	className?: string;
	delay?: number;
	width?: number;
	height?: number;
	rotate?: number;
	gradient?: string;
}) {
	return (
		<motion.div
			initial={{
				opacity: 0,
				y: -150,
				rotate: rotate - 15,
			}}
			animate={{
				opacity: 1,
				y: 0,
				rotate: rotate,
			}}
			transition={{
				duration: 2.4,
				delay,
				ease: [0.23, 0.86, 0.39, 0.96],
				opacity: { duration: 1.2 },
			}}
			className={cn("absolute", className)}
		>
			<motion.div
				animate={{
					y: [0, 15, 0],
				}}
				transition={{
					duration: 12,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
				style={{
					width,
					height,
				}}
				className="relative"
			>
				<div
					className={cn(
						"-z-40",
						"absolute inset-0 rounded-full",
						"bg-gradient-to-r to-transparent",
						gradient,
						"backdrop-blur-[2px] border-2 border-white/[0.15]",
						"shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
						"after:absolute after:inset-0 after:rounded-full",
						"after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
					)}
				/>
			</motion.div>
		</motion.div>
	);
}

export const HeaderMain = () => {
	return (
		<div className="relative h-[40rem] top-0 -z-20 w-full flex items-center justify-center">
			<div
				className={cn(
					"absolute dark:bg-black w-screen h-full bg-white -z-30",
					"[background-size:40px_40px]",
					"[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
					"dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
				)}
			/>
			<ElegantShape
				delay={0.3}
				width={600}
				height={140}
				rotate={-24}
				gradient="from-indigo-500/[0.15]"
				className="-z-20 left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
			/>

			<ElegantShape
				delay={0.5}
				width={500}
				height={120}
				rotate={-15}
				gradient="from-rose-500/[0.15]"
				className="-z-20 right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
			/>

			<ElegantShape
				delay={0.4}
				width={300}
				height={80}
				rotate={8}
				gradient="from-violet-500/[0.15]"
				className="-z-20 left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
			/>

			<ElegantShape
				delay={0.6}
				width={200}
				height={60}
				rotate={20}
				gradient="from-amber-500/[0.15]"
				className="-z-20 right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
			/>
			<div className="absolute inset-0 bg-linear-to-b from-transparent to-white/40 to-100% pointer-events-none -z-20" />
			<div className="flex flex-1 flex-col z-0 gap-4 px-8 w-full max-w-(--breakpoint-2xl) mx-auto h-screen lg:h-3/4 justify-center">
				<div className="w-3/5 pr-6 space-y-4">
					<Badge className="bg-yellow-300 text-yellow-900" variant="secondary">
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
					<Button className="z-[100] mt-4">Get a demo</Button>
				</div>
			</div>
		</div>
	);
};
