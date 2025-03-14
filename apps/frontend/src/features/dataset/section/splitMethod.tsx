"use client";
import { Label } from "@/components/ui/label";
import { Selection } from "@/components/ui/selection";
import { useGetEnum } from "@/hooks/queries/enum-api";
import { formatUnderScore } from "@/utils/capital";
import { useState } from "react";

export const SplitMethod = ({
	id,
	value: initValue,
}: { id: string; value: string }) => {
	const [value, setValue] = useState<string>(initValue);
	const { data: enumMethod } = useGetEnum();
	return (
		<div>
			<Label htmlFor="method">Split Method</Label>
			<Selection
				name="method"
				asSelect
				value={value}
				onChange={(v) => setValue(String(v))}
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
};
