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
						const inputValue = e.target.value;

						if (inputValue === "") {
							onChange(undefined);
							return;
						}

						if (/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
							if (
								inputValue === "0" ||
								inputValue === "." ||
								inputValue === "0." ||
								inputValue.startsWith("0.") ||
								inputValue.includes(".")
							) {
								onChange(inputValue);
							} else {
								const parsedValue = Number.parseFloat(inputValue);
								onChange(parsedValue);
							}
						}
					}
					onChange(e.target.value);
				}}
				onBlur={(e) => {
					if (number) {
						let currentValue = e.target.value;

						if (currentValue === "" || currentValue === ".") {
							onChange(undefined);
						} else if (currentValue.endsWith(".")) {
							currentValue = `${currentValue}0`;
							const parsedValue = Number.parseFloat(currentValue);
							onChange(parsedValue);
						} else if (
							typeof currentValue === "string" &&
							currentValue.includes(".")
						) {
							const parsedValue = Number.parseFloat(currentValue);
							onChange(parsedValue);
						}
					}
				}}
				value={
					number
						? value !== undefined
							? typeof value === "string"
								? value
								: !Number.isNaN(value)
									? String(value).endsWith(".0")
										? String(value).replace(".0", ".")
										: value
									: ""
							: ""
						: String(value).endsWith(".0")
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
				const inputValue = e.target.value;

				if (inputValue === "") {
					onChange(undefined);
					return;
				}

				if (/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
					if (
						inputValue === "0" ||
						inputValue === "." ||
						inputValue === "0." ||
						inputValue.startsWith("0.") ||
						inputValue.includes(".")
					) {
						onChange(inputValue);
					} else {
						const parsedValue = Number.parseFloat(inputValue);
						onChange(parsedValue);
					}
				}
			}}
			onBlur={(e) => {
				let currentValue = e.target.value;

				if (currentValue === "" || currentValue === ".") {
					onChange(undefined);
				} else if (currentValue.endsWith(".")) {
					currentValue = `${currentValue}0`;
					const parsedValue = Number.parseFloat(currentValue);
					onChange(parsedValue);
				} else if (
					typeof currentValue === "string" &&
					currentValue.includes(".")
				) {
					const parsedValue = Number.parseFloat(currentValue);
					onChange(parsedValue);
				}
			}}
			value={
				value !== undefined
					? typeof value === "string"
						? value
						: !Number.isNaN(value)
							? String(value).endsWith(".0")
								? String(value).replace(".0", ".")
								: value
							: ""
					: ""
			}
			placeholder={placeholder}
		/>
	</div>
);
