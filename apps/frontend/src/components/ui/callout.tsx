import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";

const variantMap = {
	info: {
		icon: Info,
		color: "border-blue-500 bg-blue-50 text-blue-800",
	},
	warning: {
		icon: AlertCircle,
		color: "border-yellow-500 bg-yellow-50 text-yellow-800",
	},
	success: {
		icon: CheckCircle2,
		color: "border-green-500 bg-green-50 text-green-800",
	},
};

export type CalloutProps = {
	children: ReactNode;
	variant?: keyof typeof variantMap;
	className?: string;
};

export function Callout({
	children,
	variant = "info",
	className,
}: CalloutProps) {
	const { icon: Icon, color } = variantMap[variant];

	return (
		<div
			className={cn(
				"my-4 flex gap-3 rounded-xl border px-4 pt-3 pb-1 text-sm",
				color,
				className,
			)}
		>
			<Icon className="mt-1 size-5 shrink-0" />
			<div className="leading-relaxed">{children}</div>
		</div>
	);
}
