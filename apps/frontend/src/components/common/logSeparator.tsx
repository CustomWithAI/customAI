import { format } from "date-fns";

interface LogDateSeparatorProps {
	date: string;
}

export function LogDateSeparator({ date }: LogDateSeparatorProps) {
	const formattedDate = format(new Date(date), "MMMM d, yyyy");

	return (
		<div className="flex items-center py-2">
			<div className="flex-grow h-px bg-border" />
			<span className="px-3 text-xs font-medium text-muted-foreground">
				{formattedDate}
			</span>
			<div className="flex-grow h-px bg-border" />
		</div>
	);
}
