import { SingleBeam } from "@/components/common/single-beam";
import { Primary, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/filp-words";
import { cn } from "@/libs/utils";

export const HeaderMain = () => {
	return (
		<div className=" h-[40rem] top-0 -z-20 w-full  relative flex items-center justify-center">
			<SingleBeam
				className={cn(
					"dark:bg-black bg-white -z-30",
					"[background-size:40px_40px]",
					"[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
					"dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
				)}
				path="M 0 8 L 132 8 M 132 8 L 132 80 M 194 80 L 132 80 M 194 80 L 194 126 M 194 126 L 297 126 M 297 126 L 297 182 M 297 182 L 449 183 M 449 183 L 449 210 M 449 210 L 575 209 M 575 209 L 575 369"
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
					<Button className="mt-8">Get a demo</Button>
				</div>
			</div>
		</div>
	);
};
