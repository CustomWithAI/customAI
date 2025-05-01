"use client";
import { Label } from "@/components/ui/label";
import { Selection } from "@/components/ui/selection";
import { useGetEnum } from "@/hooks/queries/enum-api";
import { formatUnderScore } from "@/utils/capital";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface SplitMethodRef {
	data: string;
	reset: () => void;
}

interface SplitMethodProps {
	defaultValue?: string;
}

export const SplitMethod = forwardRef<SplitMethodRef, SplitMethodProps>(
	({ defaultValue = "" }, ref) => {
		const [value, setValue] = useState<string>(defaultValue);
		const { data: enumMethod } = useGetEnum();

		useImperativeHandle(ref, () => {
			return {
				data: value,
				reset: () => {
					setValue(defaultValue);
				},
			};
		});

		return (
			<div>
				<Label htmlFor="method">Split Method</Label>
				<Selection
					name="method"
					asSelect
					placeholder="select method"
					value={value}
					onChange={(v) => setValue?.(String(v))}
					group={false}
					options={
						(enumMethod?.data?.splitMethod as string[])?.map((method) => ({
							label: formatUnderScore(method),
							value: method,
						})) || [{ label: "default", value: "default" }]
					}
				/>
			</div>
		);
	},
);
