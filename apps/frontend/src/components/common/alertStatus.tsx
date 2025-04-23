import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription } from "../ui/alert";

export const RenderStatusAlert = ({
	status,
	statusMessage,
	children,
}: {
	status: string | boolean;
	statusMessage?: string;
	children: ReactNode;
}) => {
	status =
		typeof status === "boolean" && status
			? "loading"
			: typeof status === "boolean"
				? "success"
				: status;
	if (status === "idle") return null;

	if (status === "loading") {
		return (
			<Alert>
				<div className="flex items-center space-x-4">
					<div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
					<AlertDescription className="w-full text-nowrap">
						{statusMessage || "Processing your request..."}
					</AlertDescription>
				</div>
			</Alert>
		);
	}

	if (status === "error") {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>
					{statusMessage || "An error occurred"}
				</AlertDescription>
			</Alert>
		);
	}
	return children;
};
