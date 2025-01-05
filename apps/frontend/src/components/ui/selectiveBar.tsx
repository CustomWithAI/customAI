import type { ReactNode } from "react";
import { Content, SubHeader, Subtle } from "../typography/text";

type SelectiveBarProps = {
	total: number;
	current: number;
	title: string;
	icon: ReactNode;
	type?: "dot" | "minimal";
};

export function SelectiveBar({
	total,
	current,
	title,
	icon,
	type = "dot",
}: SelectiveBarProps) {
	return (
		<>
			<div className="w-full ml-8">
				<div className="flex gap-x-3 mb-2">
					{[...Array(current > 0 ? current : 0)].map((_, index) => {
						return (
							<div
								key={`selective-previous-${index}`}
								className=" bg-[#0F172A] w-1 h-1 rounded-full"
							/>
						);
					})}
					<div className=" bg-[#658EE2] w-9 h-1 rounded-full" />
					{[...Array(total - current > 0 ? total - current - 1 : 0)].map(
						(_, index) => {
							return (
								<div
									key={`selective-next-${index}`}
									className=" bg-[#CBCBCB] w-1 h-1 rounded-full"
								/>
							);
						},
					)}
				</div>
				<Subtle className="font-medium">
					Step {current} of {total}
				</Subtle>
				<div className="flex gap-x-3.5 -ml-8">
					<div className="w-4 h-4">{icon}</div>
					<Content className="font-semibold text-lg">{title}</Content>
				</div>
			</div>
		</>
	);
}
