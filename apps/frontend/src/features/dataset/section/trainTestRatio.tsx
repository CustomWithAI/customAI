"use client";

import { SubContent } from "@/components/typography/text";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export interface RatioCalculatorRef {
	data: [number, number, number];
}

interface RatioCalculatorProps {
	defaultValue?: [number, number, number];
}

const VARIABLES: [string, string, string] = ["Train", "Test", "Valid"];
export const RatioCalculator = forwardRef<
	RatioCalculatorRef,
	RatioCalculatorProps
>(({ defaultValue }, ref) => {
	const [values, setValues] = useState<[number, number, number]>([33, 33, 34]);
	const [colors] = useState(["#2563eb", "#16a34a", "#dc2626"]);

	useImperativeHandle(ref, () => {
		return {
			data: values,
		};
	});

	const handleSliderChange = (index: number, newValue: number) => {
		if (Number.isNaN(newValue) || newValue < 0 || newValue > 100) {
			return;
		}

		if (newValue === 100) {
			const newValues: [number, number, number] = [0, 0, 0];
			newValues[index] = 100;
			setValues(newValues);
			return;
		}

		const newValues: [number, number, number] = [...values];
		const oldValue = newValues[index];
		const diff = newValue - oldValue;

		if (diff === 0) return;

		newValues[index] = newValue;

		const otherIndices = [0, 1, 2].filter((i) => i !== index);

		const otherSum = newValues[otherIndices[0]] + newValues[otherIndices[1]];

		if (diff > 0) {
			if (otherSum <= diff) {
				newValues[otherIndices[0]] = 0;
				newValues[otherIndices[1]] = 0;
				newValues[index] = 100;
			} else {
				if (otherSum > 0) {
					const ratio0 = newValues[otherIndices[0]] / otherSum;
					const ratio1 = newValues[otherIndices[1]] / otherSum;

					let decrease0 = Math.round(diff * ratio0);
					let decrease1 = Math.round(diff * ratio1);

					const adjustedSum =
						newValues[index] +
						(newValues[otherIndices[0]] - decrease0) +
						(newValues[otherIndices[1]] - decrease1);

					const adjustment = 100 - adjustedSum;

					decrease1 -= adjustment;

					decrease0 = Math.min(decrease0, newValues[otherIndices[0]]);
					decrease1 = Math.min(decrease1, newValues[otherIndices[1]]);

					newValues[otherIndices[0]] -= decrease0;
					newValues[otherIndices[1]] -= decrease1;
				} else {
					newValues[index] = 100;
					newValues[otherIndices[0]] = 0;
					newValues[otherIndices[1]] = 0;
				}
			}
		} else {
			if (otherSum > 0) {
				const ratio0 = newValues[otherIndices[0]] / otherSum;
				const ratio1 = newValues[otherIndices[1]] / otherSum;

				let increase0 = Math.round(-diff * ratio0);
				let increase1 = Math.round(-diff * ratio1);

				increase0 = Math.min(increase0, 100 - newValues[otherIndices[0]]);
				increase1 = Math.min(increase1, 100 - newValues[otherIndices[1]]);

				newValues[otherIndices[0]] += increase0;
				newValues[otherIndices[1]] += increase1;
			} else {
				newValues[otherIndices[0]] += Math.floor(-diff / 2);
				newValues[otherIndices[1]] += Math.ceil(-diff / 2);
			}
		}

		newValues.forEach((val, i) => {
			if (Number.isNaN(val)) {
				newValues[i] = i === index ? newValue : 0;
			} else {
				newValues[i] = Math.max(0, Math.min(100, val));
			}
		});

		const sum = newValues.reduce((acc, val) => acc + val, 0);
		if (sum !== 100) {
			const adjustIndices = newValues
				.map((val, i) => (i !== index && val > 0 ? i : -1))
				.filter((i) => i !== -1);
			if (adjustIndices.length > 0) {
				newValues[adjustIndices[0]] += 100 - sum;
			} else {
				newValues[index] += 100 - sum;
			}
		}

		setValues(newValues);
	};

	const handleInputChange = (index: number, value: string) => {
		if (value === "") {
			handleSliderChange(index, 0);
			return;
		}

		const newValue = Number.parseInt(value);
		if (!Number.isNaN(newValue) && newValue >= 0 && newValue <= 100) {
			handleSliderChange(index, newValue);
		}
	};

	const chartData = values.map((value, index) => ({
		name: VARIABLES[index],
		value,
	}));

	return (
		<div className="w-full">
			<SubContent>Train-Test-Valid Ratio</SubContent>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-8">
					{values.map((value, index) => (
						<div key={index} className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="font-medium">{VARIABLES[index]}</span>
								<div className="flex items-center gap-2">
									<Input
										type="number"
										min="0"
										max="100"
										value={value.toString()}
										onChange={(e) => handleInputChange(index, e.target.value)}
										className="w-16 text-right"
									/>
									<span>%</span>
								</div>
							</div>
							<Slider
								value={[value]}
								min={0}
								max={100}
								step={1}
								color={colors[index]}
								onValueChange={(newValue) =>
									handleSliderChange(index, newValue[0])
								}
								className="cursor-pointer"
							/>
						</div>
					))}
					<div className="text-center font-medium mt-4">
						Total: {values.reduce((sum, val) => sum + val, 0)}
					</div>
				</div>

				<div className="flex items-center justify-center h-64">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={chartData}
								cx="50%"
								cy="50%"
								innerRadius={0}
								outerRadius={80}
								paddingAngle={0}
								dataKey="value"
							>
								{chartData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={colors[index % colors.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
});
