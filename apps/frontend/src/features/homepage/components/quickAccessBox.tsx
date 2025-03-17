"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { Terminal } from "lucide-react";
import { type ReactElement, type ReactNode, cloneElement } from "react";

type QuickAccessBoxProps = {
	link: string;
	title: string;
	description: string;
	icon?: ReactNode;
};
export function QuickAccessBox({
	link,
	title,
	description,
	icon,
}: QuickAccessBoxProps) {
	const { asyncRoute } = useRouterAsync();
	return (
		<Alert
			className="hover:border-black hover:shadow-md duration-150 hover:cursor-pointer"
			onClick={() => asyncRoute(link)}
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
