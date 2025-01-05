import { cn } from "@/libs/utils";
import { defineString } from "@/utils/define";
import { Fragment, type ReactNode } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

type OptionValue = boolean | number | string;

interface Option {
	label: string;
	value: OptionValue;
}

type SelectionPropsType = {
	name?: string;
	cyName?: string;
	disabled?: boolean;
	onChange?: (value: string | number | boolean) => void;
	value?: string | number | boolean;
	defaultValue?: string;
	placeholder?: ReactNode;
	autoFocus?: boolean;
	className?: string;
} & (
	| {
			group: true;
			options: Record<
				string,
				{
					value: string | number | boolean;
					label: string;
					disabled?: boolean;
				}[]
			>;
	  }
	| {
			group: false;
			options: {
				value: string | number | boolean;
				label: string;
				disabled?: boolean;
			}[];
	  }
);

export const Selection = ({
	name,
	options,
	className,
	defaultValue,
	group,
	disabled,
	cyName,
	value,
	autoFocus,
	placeholder,
	onChange,
}: SelectionPropsType) => {
	const getDisplayValue = (value: OptionValue | null): string | ReactNode => {
		if (value === null) return placeholder;
		const findOptionInArray = (optArray: Option[]) =>
			optArray.find((opt) => opt.value === value);
		let option: Option | undefined;
		if (Array.isArray(options)) {
			option = findOptionInArray(options);
		} else {
			for (const key in options) {
				option = findOptionInArray(options[key]);
				if (option) break;
			}
		}
		return option ? option.label : String(value);
	};
	return (
		<Select
			value={String(value)}
			name={name}
			defaultValue={defaultValue}
			disabled={disabled}
			onValueChange={(e) => {
				onChange ? onChange(defineString(e)) : undefined;
			}}
		>
			<SelectTrigger
				className={cn(
					"my-3 w-full",
					{
						"text-zinc-500 dark:text-zinc-500":
							value === null || value === undefined,
					},
					className,
				)}
			>
				<SelectValue
					data-cy={`${cyName}_button`}
					autoFocus={autoFocus}
					placeholder={placeholder}
				>
					{getDisplayValue(value ?? null)}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{group && Boolean(options)
					? Object.keys(options).map((group) => (
							<SelectGroup key={group}>
								<SelectLabel>{group}</SelectLabel>
								{options[group].map(({ value, label, disabled }, index) => (
									<SelectItem
										key={String(value)}
										data-cy={`${cyName || ""}${index}`}
										value={typeof value !== "string" ? String(value) : value}
										disabled={disabled}
									>
										{label}
									</SelectItem>
								))}
							</SelectGroup>
						))
					: !group && Boolean(options)
						? options?.map(({ value, label, disabled }, index) => (
								<Fragment key={String(value)}>
									<SelectItem
										disabled={disabled}
										data-cy={`${cyName || ""}${index}`}
										value={typeof value !== "string" ? String(value) : value}
									>
										{label}
									</SelectItem>
								</Fragment>
							))
						: null}
			</SelectContent>
		</Select>
	);
};
