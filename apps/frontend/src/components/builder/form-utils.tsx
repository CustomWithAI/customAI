import { cn } from "@/libs/utils";
import type { ChangeEvent, ReactNode } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type TextFormItemProps = {
	label: ReactNode;
	className?: string;
	number?: boolean;
	onChange: (v: string | number | undefined) => void;
	value: string;
	placeholder?: string;
};
export const TextFormItem = ({
	label,
	className,
	onChange,
	number,
	value,
	placeholder,
}: TextFormItemProps) => (
	<FormItem className={cn("w-1/2", className)}>
		<FormLabel>{label}</FormLabel>
		<FormControl>
			<Input
				type="text"
				onChange={(e) => {
					if (number) {
						let inputValue = e.target.value.trim();
						if (inputValue.endsWith(".")) {
							inputValue += "0";
						}
						const parsedValue = inputValue !== "" ? inputValue : undefined;
						if (!Number.isNaN(parsedValue)) {
							onChange(parsedValue || "");
						}
						return;
					}
					onChange(e.target.value);
				}}
				value={
					String(value).endsWith(".0")
						? String(value).replace(".0", ".")
						: value
				}
				placeholder={placeholder}
			/>
		</FormControl>
		<FormMessage />
	</FormItem>
);
