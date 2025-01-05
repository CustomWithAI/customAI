"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { type ReactElement, type ReactNode, cloneElement } from "react";

export function OverviewBox({
	title,
	description,
	icon,
}: { title: string; description: string; icon?: ReactNode }) {
	return (
		<Alert className="hover:border-black hover:shadow-md duration-150">
			{icon ? (
				cloneElement(icon as ReactElement, {
					className: "h-4 w-4",
				})
			) : (
				<Terminal className="h-4 w-4" />
			)}
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}
