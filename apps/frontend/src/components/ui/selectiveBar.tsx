import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, memo } from "react";
import { Content, SubHeader, Subtle } from "../typography/text";

type SelectiveBarProps = {
	total: number;
	current: number;
	title: string;
	icon: ReactNode;
	type?: "dot" | "minimal";
};

export const SelectiveBar = memo(
	({ total, current, title, icon, type = "dot" }: SelectiveBarProps) => (
		<div className="w-full ml-8">
			<div className="flex gap-x-3 mb-2">
				<AnimatePresence initial={false}>
					{Array.from({ length: Math.max(0, current) }).map((_, index) => (
						<motion.div
							key={`selective-previous-${index}`}
							layoutId={`dot-${index}`}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							className="bg-[#0F172A] w-1 h-1 rounded-full"
						/>
					))}
					<motion.div
						key="current-step"
						layoutId="current-step"
						transition={{ type: "spring", stiffness: 300, damping: 20 }}
						layout="size"
						className="bg-[#658EE2] h-1 rounded-full"
						style={{ width: "2.25rem" }}
					/>
					{Array.from({ length: Math.max(0, total - current - 1) }).map(
						(_, index) => (
							<motion.div
								key={`selective-next-${index}`}
								layoutId={`dot-${current + index}`}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className="bg-[#CBCBCB] w-1 h-1 rounded-full"
							/>
						),
					)}
				</AnimatePresence>
			</div>
			<Subtle className="font-medium">
				Step {current} of {total}
			</Subtle>
			<div className="flex gap-x-3.5 -ml-8">
				<div className="w-4 h-4">{icon}</div>
				<Content className="font-semibold text-lg">{title}</Content>
			</div>
		</div>
	),
);
