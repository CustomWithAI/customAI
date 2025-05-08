"use client";

import { RenderStatusAlert } from "@/components/common/alertStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { fixDecimals } from "@/utils/fixDecimal";
import {
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Area,
	AreaChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { toCapital } from "../../../utils/toCapital";

interface ModelMetric {
	name: string;
	value: number;
}

interface ModelData {
	headers: string[];
	datasets: Array<{
		id: number;
		values: number[];
	}>;
}

export function ModelEvaluationDashboard({
	initialData,
}: {
	initialData: string;
}) {
	const [rawData, setRawData] = useState<string>(initialData);
	const [parsedData, setParsedData] = useState<ModelData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const parseData = useCallback((data: string): ModelData | null => {
		try {
			const lines = data.trim().split("\n");
			if (lines.length < 2) {
				throw new Error(
					"Data must contain at least two lines (headers and values)",
				);
			}

			const headers = lines[0].split(",").map((cell) => cell.trim());
			const datasets = lines.slice(1).map((line, index) => {
				const values = line
					.split(",")
					.map((val, valIndex) => {
						const trimVal = val.trim();
						if (headers[valIndex] === "epoch" || headers[valIndex] === "time") {
							return undefined;
						}
						const parsed = Number.parseFloat(trimVal);
						if (Number.isNaN(parsed)) {
							throw new Error(
								`Invalid number format in line ${index + 2}: ${trimVal}`,
							);
						}
						return parsed;
					})
					.filter((val) => val !== undefined) as number[];

				if (values.length > headers.length) {
					throw new Error(
						`Line ${index + 2} has ${values.length} values but should have ${headers.length}`,
					);
				}

				return {
					id: index + 1,
					values,
				};
			});

			console.log(headers, datasets);
			return {
				headers: headers.filter(
					(header) => header !== "epoch" && header !== "time",
				),
				datasets,
			};
		} catch (err) {
			setError((err as Error).message);
			console.log(err);
			return null;
		}
	}, []);

	const handleDataUpdate = useCallback(() => {
		setError(null);
		const result = parseData(rawData);
		if (result) {
			setParsedData(result);
			setSelectedMetric(null);
		}
	}, [parseData, rawData]);

	useEffect(() => {
		handleDataUpdate();
	}, [handleDataUpdate]);

	const getChartDataForMetric = (metricIndex: number) => {
		if (!parsedData) return [];

		return parsedData.datasets.map((dataset, epochIndex) => ({
			name: `${epochIndex + 1}`,
			value: dataset.values[metricIndex],
		}));
	};

	const getAllMetricsChartData = () => {
		if (!parsedData) return [];

		return parsedData.datasets.map((dataset, epochIndex) => {
			const dataPoint: Record<string, any> = {
				name: `${epochIndex + 1}`,
			};

			parsedData.headers.forEach((header, headerIndex) => {
				dataPoint[header] = dataset.values[headerIndex];
			});

			return dataPoint;
		});
	};

	const getColorForMetric = (value: number) => {
		if (value < 0.3) return "text-red-500";
		if (value < 0.7) return "text-yellow-500";
		return "text-green-500";
	};

	const getMetricColor = (index: number) => {
		const colors = [
			"#8884d8", // lavender
			"#82ca9d", // mint
			"#ffc658", // amber
			"#ff8042", // coral
			"#0088fe", // blue
			"#00C49F", // teal
			"#FFBB28", // yellow
			"#FF8042", // orange
		];
		return colors[index % colors.length];
	};

	const getBestValueForMetric = (metricIndex: number) => {
		if (!parsedData || parsedData.datasets.length <= 1) return null;

		const values = parsedData.datasets.map((d) => d.values[metricIndex]);
		return Math.max(...values);
	};

	const getAvgValueForMetric = (metricIndex: number) => {
		if (!parsedData || parsedData.datasets.length <= 1) return null;

		const values = parsedData.datasets.reduce(
			(sum, acc) => sum + acc.values[metricIndex],
			0,
		);
		return fixDecimals(values / parsedData.datasets.length);
	};

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border rounded shadow-lg">
					<p className="font-medium text-sm text-gray-600">{label}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} className="text-sm" style={{ color: entry.color }}>
							<span className="font-medium">{entry.name}:</span>{" "}
							{(entry.value * 100).toFixed(1)}%
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	const getFilteredMetrics = () => {
		if (!parsedData) return [];
		if (!selectedMetric) return parsedData.headers;
		return [selectedMetric];
	};

	const updateScrollButtons = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 0);
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
	}, []);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		updateScrollButtons();

		const handleScroll = () => updateScrollButtons();
		el.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", updateScrollButtons);

		return () => {
			if (!el) return;
			el.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", updateScrollButtons);
		};
	}, [updateScrollButtons]);

	const scroll = (direction: "left" | "right") => {
		if (!scrollRef.current) return;
		const { scrollLeft, clientWidth } = scrollRef.current;
		scrollRef.current.scrollTo({
			left:
				direction === "left"
					? scrollLeft - clientWidth
					: scrollLeft + clientWidth,
			behavior: "smooth",
		});
	};

	if (!parseData) {
		return (
			<RenderStatusAlert status={!!parseData}>
				No evaluation result found
			</RenderStatusAlert>
		);
	}

	return (
		<div className="space-y-6 h-full min-h-96">
			{parsedData &&
				(parsedData.datasets.length === 1 ? (
					<Card>
						<CardHeader>
							<CardTitle>
								{parsedData.datasets.length === 1
									? "Metrics Comparison"
									: "Metrics Comparison Across Epochs"}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{parsedData.headers.map((header, headerIndex) => (
									<div key={header} className="space-y-2">
										<div className="relative pt-1">
											{parsedData.datasets.map((dataset, index) => {
												const value = dataset.values[headerIndex];
												return (
													<div key={dataset.id} className="mb-4">
														<div className="flex items-center justify-between">
															<div className="text-sm font-medium">
																{parsedData.datasets.length === 1
																	? header
																	: `${index + 1}`}
															</div>
															<div
																className={`text-sm font-semibold ${getColorForMetric(value)}`}
															>
																{(value * 100).toFixed(1)}%
															</div>
														</div>
														<div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-100">
															<div
																style={{ width: `${value * 100}%` }}
																className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
																	value < 0.3
																		? "bg-red-400"
																		: value < 0.7
																			? "bg-yellow-400"
																			: "bg-green-400"
																}`}
															/>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className="relative">
						<CardHeader className="pb-0">
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								Training Progress
							</CardTitle>
						</CardHeader>

						<div className="absolute top-4 left-4 z-10">
							<div className="relative bg-white rounded-lg shadow-md p-1 border border-gray-200">
								{canScrollLeft && (
									<button
										onClick={() => scroll("left")}
										className="left-1 z-50 top-1/2 -translate-y-1/2 absolute p-1 rounded bg-gradient-to-r pr-2 from-white/100 to-white/90 hover:bg-gray-100 transition-colors"
									>
										<ChevronLeft className="w-4 h-4" />
									</button>
								)}
								{canScrollRight && (
									<button
										onClick={() => scroll("right")}
										className="right-1 z-50 top-1/2 -translate-y-1/2 absolute p-1 rounded  bg-gradient-to-r pr-2 from-white/90 to-white/100 hover:bg-gray-100 transition-colors"
									>
										<ChevronRight className="w-4 h-4" />
									</button>
								)}
								<div
									ref={scrollRef}
									className="relative flex space-x-1 w-full max-w-xs overflow-x-scroll no-scroll"
								>
									<button
										onClick={() => setSelectedMetric(null)}
										className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
											!selectedMetric
												? "bg-gray-100 text-gray-900"
												: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
										}`}
									>
										All
									</button>
									{parsedData.headers.map((header, index) => (
										<button
											key={header}
											onClick={() => setSelectedMetric(header)}
											className={`px-3 py-1.5 text-sm font-medium text-nowrap rounded-md transition-colors ${
												selectedMetric === header
													? "bg-gray-100 text-gray-900"
													: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
											}`}
											style={{
												borderBottom:
													selectedMetric === header
														? `2px solid ${getMetricColor(index)}`
														: "none",
											}}
										>
											{toCapital(header.split(" ").pop() || "")}{" "}
										</button>
									))}
								</div>
							</div>
						</div>

						<CardContent>
							{/* Combined chart for "All" view */}
							{!selectedMetric ? (
								<Card className="overflow-hidden border-0 shadow-sm mb-6">
									<CardHeader className="bg-gray-50 py-2">
										<CardTitle className="text-base">All Metrics</CardTitle>
									</CardHeader>
									<CardContent className="p-0">
										<div className="h-64 pt-4">
											<ResponsiveContainer width="100%" height="100%">
												<AreaChart
													data={getAllMetricsChartData()}
													margin={{
														top: 10,
														right: 30,
														left: 0,
														bottom: 0,
													}}
												>
													{parsedData.headers.map((header, index) => (
														<defs key={`gradient-${index}`}>
															<linearGradient
																id={`color${index}`}
																x1="0"
																y1="0"
																x2="0"
																y2="1"
															>
																<stop
																	offset="5%"
																	stopColor={getMetricColor(index)}
																	stopOpacity={0.8}
																/>
																<stop
																	offset="95%"
																	stopColor={getMetricColor(index)}
																	stopOpacity={0.1}
																/>
															</linearGradient>
														</defs>
													))}
													<XAxis
														dataKey="name"
														axisLine={false}
														tickLine={false}
														tick={{ fontSize: 12 }}
													/>
													<YAxis
														tickFormatter={(value) =>
															`${(value * 100).toFixed(0)}%`
														}
														domain={[0, (dataMax: any) => dataMax * 1.1]}
														axisLine={false}
														tickLine={false}
														tick={{ fontSize: 12 }}
														width={40}
													/>
													<Tooltip content={<CustomTooltip />} />
													{parsedData.headers.map((header, index) => (
														<Area
															key={header}
															type="monotone"
															dataKey={header}
															stroke={getMetricColor(index)}
															fillOpacity={0.5}
															fill={`url(#color${index})`}
															strokeWidth={2}
														/>
													))}
												</AreaChart>
											</ResponsiveContainer>
										</div>
										<div className="px-4 py-3 bg-gray-50">
											<div className="flex flex-wrap gap-3">
												{parsedData.headers.map((header, index) => (
													<div
														key={header}
														className="flex items-center gap-1.5 text-xs"
														style={{ color: getMetricColor(index) }}
													>
														<div
															className="w-3 h-3 rounded-full"
															style={{
																backgroundColor: getMetricColor(index),
															}}
														/>
														<span className="font-medium">{header}</span>
													</div>
												))}
											</div>
										</div>
									</CardContent>
								</Card>
							) : (
								<div className="grid grid-cols-1 gap-6">
									{getFilteredMetrics().map((metric) => {
										const index = parsedData.headers.indexOf(metric);
										const bestValue = getBestValueForMetric(index);
										const avgValue = getAvgValueForMetric(index);
										return (
											<Card
												key={metric}
												className="overflow-hidden border-0 shadow-sm"
											>
												<CardHeader
													className="py-2"
													style={{
														background: `linear-gradient(to right, ${getMetricColor(index)}15, transparent)`,
														borderLeft: `4px solid ${getMetricColor(index)}`,
													}}
												>
													<CardTitle className="text-base">
														{toCapital(metric)}
													</CardTitle>
												</CardHeader>
												<CardContent className="p-0">
													<div className="h-48 pt-4">
														<ResponsiveContainer width="100%" height="100%">
															<AreaChart
																data={getChartDataForMetric(index)}
																margin={{
																	top: 10,
																	right: 10,
																	left: 0,
																	bottom: 0,
																}}
															>
																<defs>
																	<linearGradient
																		id={`color${index}`}
																		x1="0"
																		y1="0"
																		x2="0"
																		y2="1"
																	>
																		<stop
																			offset="5%"
																			stopColor={getMetricColor(index)}
																			stopOpacity={0.8}
																		/>
																		<stop
																			offset="95%"
																			stopColor={getMetricColor(index)}
																			stopOpacity={0.1}
																		/>
																	</linearGradient>
																</defs>
																<XAxis
																	dataKey="name"
																	axisLine={false}
																	tickLine={false}
																	tick={{ fontSize: 12 }}
																/>
																<YAxis
																	tickFormatter={(value) =>
																		`${(value * 100).toFixed(0)}%`
																	}
																	domain={[
																		0,
																		(dataMax: any) =>
																			Math.max(1, dataMax * 1.1),
																	]}
																	axisLine={false}
																	tickLine={false}
																	tick={{ fontSize: 12 }}
																	width={40}
																/>
																<Tooltip
																	content={({ active, payload, label }) => {
																		if (active && payload && payload.length) {
																			return (
																				<div className="bg-white p-2 border rounded shadow text-xs">
																					<p className="font-medium">{label}</p>
																					<p
																						style={{
																							color: getMetricColor(index),
																						}}
																					>
																						{metric}:{" "}
																						{(
																							((payload[0]?.value as number) ||
																								0) * 100
																						).toFixed(2)}
																						%
																					</p>
																				</div>
																			);
																		}
																		return null;
																	}}
																/>
																{bestValue && (
																	<ReferenceLine
																		y={bestValue}
																		stroke="#888"
																		strokeDasharray="3 3"
																		label={{
																			value: `Best: ${(bestValue * 100).toFixed(2)}%`,
																			position: "insideTopRight",
																			className: "bg-white",
																			tabIndex: 50,
																			fill: "#888",
																			fontSize: 12,
																		}}
																	/>
																)}
																{avgValue && (
																	<ReferenceLine
																		y={avgValue}
																		stroke="#888"
																		strokeDasharray="3 3"
																		label={{
																			value: `Avg: ${(avgValue * 100).toFixed(1)}%`,
																			position: "insideTopRight",
																			tabIndex: 50,
																			fill: "#888",
																			fontSize: 12,
																		}}
																	/>
																)}
																<Area
																	type="monotone"
																	dataKey="value"
																	stroke={getMetricColor(index)}
																	fillOpacity={1}
																	fill={`url(#color${index})`}
																/>
															</AreaChart>
														</ResponsiveContainer>
													</div>
													<div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
														<span className="text-xs text-gray-500">
															Range:{" "}
															{(
																Math.min(
																	...getChartDataForMetric(index).map(
																		(d) => d.value,
																	),
																) * 100
															).toFixed(1)}
															% -
															{(
																Math.max(
																	...getChartDataForMetric(index).map(
																		(d) => d.value,
																	),
																) * 100
															).toFixed(1)}
															%
														</span>
														<span
															className="text-xs font-medium"
															style={{ color: getMetricColor(index) }}
														>
															Last:{" "}
															{(
																getChartDataForMetric(index)[
																	getChartDataForMetric(index).length - 1
																].value * 100
															).toFixed(1)}
															%
														</span>
													</div>
												</CardContent>
											</Card>
										);
									})}
								</div>
							)}
						</CardContent>
					</Card>
				))}
		</div>
	);
}
