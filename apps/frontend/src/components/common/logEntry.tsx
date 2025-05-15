import { cn } from "@/lib/utils";
import type { ResponseLog } from "@/types/logs";
import { format } from "date-fns";
import { AlertCircle, AlertTriangle, Info, Terminal } from "lucide-react";

interface LogEntryProps {
	log: ResponseLog;
}

export function LogEntryItem({ log }: LogEntryProps) {
	const { data, createdAt } = log;

	const levelIcons = {
		info: <Info className="h-4 w-4 text-blue-500" />,
		warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
		error: <AlertCircle className="h-4 w-4 text-red-500" />,
		debug: <Terminal className="h-4 w-4 text-gray-500" />,
	};

	const levelClasses = {
		info: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50",
		warning:
			"border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50",
		error: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50",
		debug:
			"border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50",
	};

	const time = format(new Date(createdAt), "HH:mm:ss");

	return (
		<div
			className={cn("p-3 border rounded-md mb-2 text-sm", levelClasses.debug)}
		>
			<div className="flex items-center gap-2 mb-1">
				{levelIcons.debug}
				<span className="font-medium">{time}</span>
			</div>
			<div className="ml-6">
				<p className="whitespace-pre-wrap break-words">{data}</p>
			</div>
		</div>
	);
}
