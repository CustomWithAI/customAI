import { cn } from "@/libs/utils";
import type { ChangeEvent } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type TextFormItemProps = {
	label: string;
	className?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	value: string;
	placeholder?: string;
};
export const TextFormItem = ({
	label,
	className,
	onChange,
	value,
	placeholder,
}: TextFormItemProps) => (
	<FormItem className={cn("w-1/2")}>
		<FormLabel>{label}</FormLabel>
		<FormControl>
			<Input
				type="text"
				onChange={onChange}
				value={value}
				placeholder={placeholder}
			/>
		</FormControl>
		<FormMessage />
	</FormItem>
);
