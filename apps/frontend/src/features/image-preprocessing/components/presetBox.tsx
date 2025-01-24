"use client";
import { Subtle } from "@/components/typography/text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/libs/utils";
import { Terminal } from "lucide-react";
import { type ReactElement, type ReactNode, cloneElement } from "react";

type PresetBoxProps = {
	current?: boolean;
	onClick: () => void;
	title: string;
	description: string;
	icon?: ReactNode;
};
export function PresetBox({
	current = false,
	onClick,
	title,
	description,
	icon,
}: PresetBoxProps) {
	return (
		<Alert
			className={cn(
				"hover:border-black hover:shadow-md duration-150 py-5 hover:cursor-pointer",
				{ "border-black shadow-md": current },
			)}
			onClick={onClick}
		>
			{icon ? (
				cloneElement(icon as ReactElement, {
					className: "h-4 w-4 mt-1",
				})
			) : (
				<Terminal className="h-4 w-4 mt-1" />
			)}
			<AlertTitle>{title}</AlertTitle>
			<Subtle>{description}</Subtle>
		</Alert>
	);
}
