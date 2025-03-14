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
			<motion.div layout className="flex items-center gap-x-3 mb-2">
				{Array.from({ length: total }).map((_, index) => (
					<motion.div
						key={index}
						layoutId={`dot-${index}`}
						transition={{ type: "spring", stiffness: 300, damping: 20 }}
						className={`h-1 rounded-full ${
							index < current - 1
								? "bg-[#0F172A] w-1"
								: index === current - 1
									? "bg-[#658EE2]"
									: "bg-[#CBCBCB] w-1"
						}`}
						style={{ width: index === current - 1 ? "2.25rem" : "0.25rem" }}
					/>
				))}
			</motion.div>
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
