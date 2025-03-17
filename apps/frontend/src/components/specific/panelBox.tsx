"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";

import { cn } from "@/libs/utils";
import { Terminal } from "lucide-react";
import { type ReactElement, type ReactNode, cloneElement } from "react";

export function OverviewBox({
	title,
	description,
	disabled,
	icon,
	href,
}: {
	title: string;
	description: string;
	icon?: ReactNode;
	href?: string;
	disabled?: boolean;
}) {
	const { asyncRoute, isLoadingRoute } = useRouterAsync();
	return (
		<Alert
			className={cn("hover:border-black hover:shadow-md duration-150", {
				"cursor-not-allowed": isLoadingRoute || disabled,
			})}
			onClick={() => href && asyncRoute(href)}
		>
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
