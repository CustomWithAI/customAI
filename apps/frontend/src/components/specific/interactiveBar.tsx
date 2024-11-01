"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const initialData = [{ name: "Data", test: 30, train: 40, validation: 30 }];

const chartConfig = {
	test: { label: "Test", color: "hsl(var(--chart-1))" },
	train: { label: "Train", color: "hsl(var(--chart-2))" },
	validation: { label: "Validation", color: "hsl(var(--chart-3))" },
};

export default function Component() {
	const [data, setData] = useState(initialData);

	const handleDrag = (delta: number, dataKey?: string) => {
		if (!dataKey) {
			return;
		}
		setData((prevData) => {
			const newData = [...prevData];
			const item = { ...newData[0] };
			const { name, ...valueItem } = item;

			const newValue = Math.max(
				5,
				Math.min(90, (valueItem as Record<string, number>)[dataKey] + delta),
			);
			const otherKeys = Object.keys(item).filter(
				(key) => key !== "name" && key !== dataKey,
			);

			const totalOthers = otherKeys.reduce(
				(sum, key) => sum + (valueItem as Record<string, number>)[key],
				0,
			);
			const remainingValue = 100 - newValue;

			for (const key of otherKeys) {
				(valueItem as Record<string, number>)[key] = Math.max(
					5,
					Math.round(
						((valueItem as Record<string, number>)[key] / totalOthers) *
							remainingValue,
					),
				);
			}
			const currentTotal = Object.values(valueItem).reduce(
				(sum: number, val: number) =>
					typeof val === "number" ? sum + val : sum,
				0,
			);
			if (currentTotal !== 100) {
				const diff = 100 - currentTotal;
				const lastKey = otherKeys[otherKeys.length - 1];
				(valueItem as Record<string, number>)[lastKey] += diff;
			}

			(valueItem as Record<string, number>)[dataKey] = newValue;
			newData[0] = item;
			return newData;
		});
	};

	const CustomBar = (props: {
		fill?: string;
		x?: string | number;
		y?: string | number;
		width?: string | number;
		height?: string | number;
		dataKey?: string;
	}) => {
		const { x, y, width, height, dataKey } = props;
		return (
			<g>
				<rect x={x} y={y} width={width} height={height} fill={props.fill} />
				<foreignObject x={x} y={y} width={width} height={height}>
					<div
						className="h-full w-full cursor-ns-resize"
						onMouseDown={(e) => {
							const startY = e.clientY;
							const handleMouseMove = (moveEvent: MouseEvent) => {
								const currentY = moveEvent.clientY;
								const delta = Math.round((startY - currentY) / 2);
								handleDrag(delta, dataKey);
							};
							const handleMouseUp = () => {
								document.removeEventListener("mousemove", handleMouseMove);
								document.removeEventListener("mouseup", handleMouseUp);
							};
							document.addEventListener("mousemove", handleMouseMove);
							document.addEventListener("mouseup", handleMouseUp);
						}}
					/>
				</foreignObject>
			</g>
		);
	};

	return (
		<Card className="w-full max-w-3xl">
			<CardHeader>
				<CardTitle>Interactive Vertical Bar Chart</CardTitle>
				<CardDescription>
					Drag sections to adjust values (always sums to 100%, minimum 5% each)
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px]">
					<BarChart data={data} layout="vertical" stackOffset="expand">
						<CartesianGrid strokeDasharray="3 3" horizontal={false} />
						<XAxis type="category" dataKey="name" hide />
						<YAxis
							type="number"
							domain={[0, 1]}
							tickFormatter={(value) => `${Math.round(value * 100)}%`}
						/>
						<Tooltip
							formatter={(value, name, props) => [
								`${Math.round(Number(value))}%`,
								name,
							]}
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									return (
										<div className="bg-background border border-border p-2 rounded shadow">
											<p className="font-bold">{payload[0].name}</p>
											<p>{`${Math.round(Number(payload[0].value))}%`}</p>
										</div>
									);
								}
								return null;
							}}
						/>
						<Legend />
						<Bar
							dataKey="test"
							fill={chartConfig.test.color}
							shape={<CustomBar />}
							stackId="a"
						/>
						<Bar
							dataKey="train"
							fill={chartConfig.train.color}
							shape={<CustomBar />}
							stackId="a"
						/>
						<Bar
							dataKey="validation"
							fill={chartConfig.validation.color}
							shape={<CustomBar />}
							stackId="a"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
