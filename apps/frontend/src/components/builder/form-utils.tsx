import { cn } from "@/libs/utils";
import type { ChangeEvent, ReactNode } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TextFormItemProps = {
	id?: string;
	label: ReactNode;
	className?: string;
	number?: boolean;
	onChange: (v: string | number | undefined) => void;
	value: string;
	placeholder?: string;
};
export const TextFormItem = ({
	id,
	label,
	className,
	onChange,
	number,
	value,
	placeholder,
}: TextFormItemProps) => (
	<FormItem className={cn("w-1/2", className)}>
		<FormLabel htmlFor={id} className="text-black/50 text-sm">
			{label}
		</FormLabel>
		<FormControl>
			<Input
				type="text"
				id={id}
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

export const NumberInput = ({
	id,
	label,
	className,
	onChange,
	number,
	value,
	placeholder,
}: Omit<TextFormItemProps, "label"> & { label?: ReactNode }) => (
	<div className={cn("space-y-4", className)}>
		{label && <Label htmlFor={id}>{label}</Label>}
		<Input
			type="text"
			id={id}
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
				String(value).endsWith(".0") ? String(value).replace(".0", ".") : value
			}
			placeholder={placeholder}
		/>
	</div>
);
