"use client";
import { TextFormItem } from "@/components/builder/form-utils";
import { ContentHeader } from "@/components/typography/text";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/libs/utils";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import { findById } from "@/utils/findId";
import { IconBlur } from "@tabler/icons-react";
import {
	CV_8U,
	INTER_LINEAR,
	NORM_MINMAX,
	Point,
	Rect,
	Size,
	THRESH_BINARY,
} from "@techstark/opencv-js";
import {
	ArrowDownWideNarrow,
	Axis3d,
	Binary,
	Crop,
	Cuboid,
	DraftingCompass,
	Droplet,
	FlipHorizontal2,
	Percent,
	RotateCcw,
	Scaling,
	Spline,
} from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { z } from "zod";

const Corner = ["top-left", "top-right", "bottom-left", "bottom-right"];
const CornerIcon: Record<string, ReactNode | undefined>[] = [
	{
		x: <Spline key="top-left" className="size-5" />,
		y: <div className="size-5" />,
	},
	{
		x: <div className="size-5" />,
		y: <Spline key="top-right" className="size-5 ml-auto rotate-90" />,
	},
	{
		x: <Spline key="bottom-left" className="size-5 -rotate-90 " />,
		y: <div className="size-5" />,
	},
	{
		x: <div className="size-5" />,
		y: <Spline key="bottom-right" className="size-5 ml-auto rotate-180" />,
	},
];

export const node = (
	fields: DragColumn<z.ZodRawShape>[],
	onUpdateMetadata: (payload: {
		id: string;
		metadata: Metadata;
	}) => void,
): DragColumn[] => {
	return [
		{
			type: "resize",
			title: "Resizing Node",
			description: "Evaluates a condition and routes the flow",
			icon: <Scaling />,
			id: "resizing-1",
			metadata: {
				size: {
					type: "Object",
					value: {
						x: { type: "Number", value: 80 },
						y: { type: "Number", value: 80 },
					},
				},
			},
			previewImg: [
				{
					type: "resizing",
					params: [
						Number(
							(findById(fields, "resizing-1")?.metadata as any)?.size?.value?.x
								?.value,
						),
						Number(
							(findById(fields, "resizing-1")?.metadata as any)?.size?.value?.y
								?.value,
						),
					],
				},
			],
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "resizing-form",
						renderCustomInput() {
							return (
								<div className="flex gap-x-3">
									{["x", "y"].map((axis) => (
										<TextFormItem
											number
											key={`resizing-${axis}`}
											className="w-1/2"
											label={axis.toLocaleUpperCase()}
											onChange={(e) => {
												onUpdateMetadata({
													id: "resizing-1",
													metadata: {
														size: {
															type: "Object",
															value: {
																[axis]: {
																	type: "Number",
																	value: e as number,
																},
															},
														},
													},
												});
											}}
											value={
												(findById(fields, "resizing-1")?.metadata as any)?.size
													?.value?.[axis]?.value
											}
										/>
									))}
								</div>
							);
						},
					},
					config: {},
				},
			],
			inputSchema: z.object({
				size: z.object({
					x: z.string(),
					y: z.string(),
				}),
			}),
		},
		{
			type: "crop",
			title: "Cropping Node",
			description: "Processes the input value",
			icon: <Crop />,
			id: "cropping-1",
			metadata: {
				size: {
					type: "Object",
					value: {
						x: { type: "Number", value: 50 },
						y: { type: "Number", value: 50 },
					},
				},
				crop_position: {
					type: "Object",
					value: {
						x: { type: "Number", value: 100 },
						y: { type: "Number", value: 100 },
					},
				},
			},
			previewImg: [
				{
					type: "crop",
					params: [
						((findById(fields, "cropping-1")?.metadata as any)?.size?.value?.x
							?.value as number) || 50,
						(findById(fields, "cropping-1")?.metadata as any)?.size?.value?.y
							?.value || 50,
						(findById(fields, "cropping-1")?.metadata as any)?.crop_position
							?.value?.x?.value || 100,
						(findById(fields, "cropping-1")?.metadata as any)?.crop_position
							?.value?.y?.value || 100,
					],
				},
			],
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "cropping-form",
						renderCustomInput() {
							return (
								<>
									<ContentHeader>Size</ContentHeader>
									<div className="flex gap-x-3">
										{["x", "y"].map((axis) => (
											<TextFormItem
												number
												key={`cropping-${axis}`}
												className="w-1/2"
												label={axis.toUpperCase()}
												onChange={(e) => {
													onUpdateMetadata({
														id: "cropping-1",
														metadata: {
															size: {
																type: "Object",
																value: {
																	[axis]: {
																		type: "Number",
																		value: e as number,
																	},
																},
															},
														},
													});
												}}
												value={
													(findById(fields, "cropping-1")?.metadata as any)
														?.size?.value?.[axis]?.value
												}
												placeholder="0"
											/>
										))}
									</div>
									<ContentHeader className="mt-2">Position</ContentHeader>
									<div className="flex gap-x-3">
										{["x", "y"].map((axis) => (
											<TextFormItem
												number
												key={`crop_position-${axis}`}
												className="w-1/2"
												label={axis.toUpperCase()}
												onChange={(v) => {
													onUpdateMetadata({
														id: "cropping-1",
														metadata: {
															crop_position: {
																type: "Object",
																value: {
																	[axis]: {
																		type: "Number",
																		value: v as number,
																	},
																},
															},
														},
													});
												}}
												value={
													(findById(fields, "cropping-1")?.metadata as any)
														?.crop_position?.value?.[axis]?.value
												}
												placeholder="0"
											/>
										))}
									</div>
								</>
							);
						},
					},
					config: {},
				},
			],
			inputSchema: z.object({
				size: z.object({
					x: z.string(),
					y: z.string(),
				}),
				crop_position: z.object({
					x: z.string(),
					y: z.string(),
				}),
			}),
		},
		{
			type: "rotate",
			title: "Rotation",
			description: "Displays the final output",
			icon: <RotateCcw />,
			id: "rotation-1",
			metadata: {
				angle: { type: "Number", value: 45 },
			},
			previewImg: [
				{
					type: "rotate",
					angle: Number(
						findById(fields, "rotation-1")?.metadata?.angle?.value || 45,
					),
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						label: "Angle",
						placeholder: "0",
						name: "angle",
						key: "angle-1",
						testDataId: "angle-rotation-1",
					},
					config: {
						setValue: findById(fields, "rotation-1")?.metadata?.angle?.value,
						setOnChange: (value) => {
							onUpdateMetadata({
								id: "rotation-1",
								metadata: {
									angle: { type: "Number", value: value as number },
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				angle: z.string(),
			}),
		},
		{
			type: "flip",
			title: "Flipping",
			description: "Displays the final output",
			icon: <FlipHorizontal2 />,
			id: "flipping-1",
			metadata: {
				direction: { type: "Number", value: 1 },
			},
			previewImg: [
				{
					type: "opencv",
					method: "flip",
					params: [
						Number(findById(fields, "flipping-1")?.metadata?.direction?.value),
					],
				},
			],
			inputField: [
				{
					template: "select",
					element: {
						label: "Direction",
						key: "direction-1",
						name: "direction",
						testDataId: "direction-test",
					},
					config: {
						setValue: findById(fields, "flipping-1")?.metadata?.direction
							?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "flipping-1",
								metadata: {
									direction: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							group: false,
							list: [
								{ value: 0, label: "vertically" },
								{ value: 1, label: "horizontally" },
								{ value: -1, label: "both" },
							],
						},
					},
				},
			],
			inputSchema: z.object({
				direction: z.string(),
			}),
		},
		{
			type: "grayscale",
			title: "Gray scale",
			description: "Adjust grayscale image",
			icon: <Droplet />,
			id: "grayscale-1",
			metadata: {
				gray_scale: {
					type: "Boolean",
					value: true,
				},
			},
			previewImg: [
				{
					type: "style",
					value: `grayscale(${
						findById(fields, "grayscale-1")?.metadata?.gray_scale?.value !==
						false
							? "100%"
							: "0%"
					})`,
				},
			],
			inputField: [
				{
					template: "switch",
					element: {
						testDataId: "grayscale-form",
						label: "Enable status",
						key: "grayscale-1",
						name: "grayscale",
						required: true,
					},
					config: {
						setValue: findById(fields, "grayscale-1")?.metadata?.gray_scale
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "grayscale-1",
								metadata: {
									gray_scale: {
										type: "Boolean",
										value: value as boolean,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				gray_scale: z.boolean().default(false),
			}),
		},
		{
			type: "pers_trans",
			title: "Perspective Transformation",
			description: "Displays the final output",
			icon: <Axis3d />,
			id: "perspective-1",
			metadata: {
				source: {
					type: "Object",
					value: {
						"top-left": {
							type: "Object",
							value: {
								x: { type: "Number", value: 0 },
								y: { type: "Number", value: 0 },
							},
						},
						"top-right": {
							type: "Object",
							value: {
								x: { type: "Number", value: 0 },
								y: { type: "Number", value: 100 },
							},
						},
						"bottom-left": {
							type: "Object",
							value: {
								x: { type: "Number", value: 100 },
								y: { type: "Number", value: 0 },
							},
						},
						"bottom-right": {
							type: "Object",
							value: {
								x: { type: "Number", value: 100 },
								y: { type: "Number", value: 100 },
							},
						},
					},
				},
				destination: {
					type: "Object",
					value: {
						"top-left": {
							type: "Object",
							value: {
								x: { type: "Number", value: 10 },
								y: { type: "Number", value: 10 },
							},
						},
						"top-right": {
							type: "Object",
							value: {
								x: { type: "Number", value: 90 },
								y: { type: "Number", value: 20 },
							},
						},
						"bottom-left": {
							type: "Object",
							value: {
								x: { type: "Number", value: 20 },
								y: { type: "Number", value: 90 },
							},
						},
						"bottom-right": {
							type: "Object",
							value: {
								x: { type: "Number", value: 90 },
								y: { type: "Number", value: 90 },
							},
						},
					},
				},
			},
			inputSchema: z.object({
				source: z.object({
					"top-left": z.object({
						x: z.number(),
						y: z.number(),
					}),
					"top-right": z.object({
						x: z.number(),
						y: z.number(),
					}),
					"bottom-left": z.object({
						x: z.number(),
						y: z.number(),
					}),
					"bottom-right": z.object({
						x: z.number(),
						y: z.number(),
					}),
				}),
				destination: z.object({
					"top-left": z.object({
						x: z.number(),
						y: z.number(),
					}),
					"top-right": z.object({
						x: z.number(),
						y: z.number(),
					}),
					"bottom-left": z.object({
						x: z.number(),
						y: z.number(),
					}),
					"bottom-right": z.object({
						x: z.number(),
						y: z.number(),
					}),
				}),
			}),
			previewImg: [
				{
					type: "perspective",
					srcPoints: [
						[
							(findById(fields, "perspective-1")?.metadata as any)?.source
								?.value?.["top-left"]?.value?.x?.value || 0,
							(findById(fields, "perspective-1")?.metadata as any)?.source
								?.value?.["top-left"]?.value?.y?.value || 0,
						],
						[
							(findById(fields, "perspective-1")?.metadata as any)?.source
								?.value?.["top-right"]?.value?.x?.value || 0,
							(findById(fields, "perspective-1")?.metadata as any)?.source
								?.value?.["top-right"]?.value?.y?.value || 100,
						],
						[
							(findById(fields, "perspective-1")?.metadata as any)?.source
								?.value?.["bottom-left"]?.value?.x?.value || 100,
							(findById(fields, "perspective-1")?.metadata as any)?.source
								?.value?.["bottom-left"]?.value?.y?.value || 0,
						],
						[
							(findById(fields, "perspective-1")?.metadata as any)?.source
								?.value?.["bottom-right"]?.value?.x?.value || 100,
							(findById(fields, "perspective-1")?.metadata as any)?.source
								?.value?.["bottom-right"]?.value?.y?.value || 100,
						],
					],
					dstPoints: [
						[
							(findById(fields, "perspective-1")?.metadata as any)?.destination
								?.value?.["top-left"]?.value?.x?.value || 10,
							(findById(fields, "perspective-1")?.metadata as any)?.destination
								?.value?.["top-left"]?.value?.y?.value || 10,
						],
						[
							(findById(fields, "perspective-1")?.metadata as any)?.destination
								?.value?.["top-right"]?.value?.x?.value || 20,
							(findById(fields, "perspective-1")?.metadata as any)?.destination
								?.value?.["top-right"]?.value?.y?.value || 90,
						],
						[
							(findById(fields, "perspective-1")?.metadata as any)?.destination
								?.value?.["bottom-left"]?.value?.x?.value || 90,
							(findById(fields, "perspective-1")?.metadata as any)?.destination
								?.value?.["bottom-left"]?.value?.y?.value || 10,
						],
						[
							(findById(fields, "perspective-1")?.metadata as any)?.destination
								?.value?.["bottom-right"]?.value?.x?.value || 80,
							(findById(fields, "perspective-1")?.metadata as any)?.destination
								?.value?.["bottom-right"]?.value?.y?.value || 80,
						],
					],
				},
			],
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "perspective-form",
						renderCustomInput({ control }) {
							return (
								<div className="flex flex-col">
									<ContentHeader>Source Point</ContentHeader>
									<div className="grid grid-cols-2 gap-x-3 gap-y-2">
										{Array.from({ length: 4 }, () => ["x", "y"]).map(
											(corner, index) => (
												<div
													className="w-full flex gap-x-1"
													key={`source-${index}`}
												>
													{corner.map((axis) => (
														<TextFormItem
															number
															key={`source-${axis}`}
															label={CornerIcon?.[index]?.[axis]}
															className="w-1/2"
															onChange={(e) => {
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		source: {
																			type: "Object",
																			value: {
																				[Corner[index]]: {
																					type: "Object",
																					value: {
																						[axis]: {
																							type: "Number",
																							value: e as number,
																						},
																					},
																				},
																			},
																		},
																	},
																});
															}}
															value={
																(
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.source?.value?.[Corner[index]]?.value?.[axis]
																	?.value || undefined
															}
															placeholder={axis}
														/>
													))}
												</div>
											),
										)}
									</div>
									<ContentHeader className="mt-4">
										Destination Point
									</ContentHeader>
									<div className="grid grid-cols-2 gap-x-3 gap-y-2">
										{Array.from({ length: 4 }, () => ["x", "y"]).map(
											(corner, index) => (
												<div
													className="w-full flex gap-x-1"
													key={`source-${index}`}
												>
													{corner.map((axis) => (
														<TextFormItem
															number
															key={`source-${axis}`}
															label={CornerIcon?.[index]?.[axis]}
															className="w-1/2"
															onChange={(e) => {
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		destination: {
																			type: "Object",
																			value: {
																				[Corner[index]]: {
																					type: "Object",
																					value: {
																						[axis]: {
																							type: "Number",
																							value: e as number,
																						},
																					},
																				},
																			},
																		},
																	},
																});
															}}
															value={
																(
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.source?.value?.[Corner[index]]?.value?.[axis]
																	?.value || undefined
															}
															placeholder={axis}
														/>
													))}
												</div>
											),
										)}
									</div>
								</div>
							);
						},
					},
					config: {},
				},
			],
		},
		{
			type: "thresh_percent",
			title: "Percentage Tresholding",
			description: "Displays the final output",
			icon: <Percent />,
			id: "percentage-1",
			metadata: {
				percentage: { type: "Number", value: 80 },
			},
			previewImg: [
				{
					type: "threshold",
					threshold:
						(findById(fields, "percentage-1")?.metadata?.percentage
							?.value as number) || 70,
					maxValue: 255,
					thresholdType: THRESH_BINARY,
				},
			],
			inputField: [
				{
					template: "percent",
					element: {
						label: "Percentage",
						key: "percentage-input-1",
						name: "percentage",
						testDataId: "percentage-test",
					},
					config: {
						setValue: findById(fields, "percentage-1")?.metadata?.percentage
							?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "percentage-1",
								metadata: {
									percentage: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				percentage: z.number().min(0).max(100),
			}),
		},
		{
			type: "mean_blur",
			title: "Mean Blur",
			description: "Evaluates a condition and routes the flow",
			icon: <ArrowDownWideNarrow />,
			id: "mean-blur-1",
			metadata: {
				kernel_size: {
					type: "Object",
					value: {
						x: { type: "Number", value: 1 },
						y: { type: "Number", value: 1 },
					},
				},
			},
			previewImg: [
				{
					type: "meanBlur",
					params: [
						(findById(fields, "mean-blur-1")?.metadata as any)?.kernel_size
							?.value?.x?.value || 5,
						(findById(fields, "mean-blur-1")?.metadata as any)?.kernel_size
							?.value?.y?.value || 5,
					],
				},
			],
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "mean-blur-form",
						renderCustomInput({ control }) {
							return (
								<FormField
									control={control}
									name="kernel_size.x"
									render={({ field: { onChange, value } }) => (
										<div className="flex gap-x-3">
											<TextFormItem
												number
												className="w-1/2"
												label="X"
												onChange={(e) => {
													onUpdateMetadata({
														id: "mean-blur-1",
														metadata: {
															kernel_size: {
																type: "Object",
																value: {
																	x: {
																		type: "Number",
																		value: e as number,
																	},
																},
															},
														},
													});
												}}
												value={
													(findById(fields, "mean-blur-1")?.metadata as any)
														?.kernel_size?.value?.x?.value
												}
											/>
											<TextFormItem
												number
												className="w-1/2"
												label="Y"
												onChange={(e) => {
													onUpdateMetadata({
														id: "mean-blur-1",
														metadata: {
															kernel_size: {
																type: "Object",
																value: {
																	y: {
																		type: "Number",
																		value: e as number,
																	},
																},
															},
														},
													});
												}}
												value={
													(findById(fields, "mean-blur-1")?.metadata as any)
														?.kernel_size?.value?.y?.value
												}
											/>
										</div>
									)}
								/>
							);
						},
					},
					config: {},
				},
			],
			inputSchema: z.object({
				kernel_size: z.object({
					x: z.string(),
					y: z.string(),
				}),
			}),
		},
		{
			type: "median_blur",
			title: "Median blur",
			description: "Evaluates a condition and routes the flow",
			icon: <ArrowDownWideNarrow />,
			id: "median-blur-1",
			metadata: {
				kernel_size: {
					type: "Number",
					value: 3,
				},
			},
			previewImg: [
				{
					type: "medianBlur",
					params: [
						(findById(fields, "median-blur-1")?.metadata as any)?.kernel_size
							?.value || 3,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "median-blur-form",
						label: "Mean blur size",
						name: "kernel_size",
						key: "kernel_size-median",
					},
					config: {
						setOnChange: (value) => {
							onUpdateMetadata({
								id: "median-blur-1",
								metadata: {
									kernel_size: {
										type: "Number",
										value: Number(value),
									},
								},
							});
						},
						setValue: (findById(fields, "median-blur-1")?.metadata as any)
							?.kernel_size?.value,
					},
				},
			],
			inputSchema: z.object({
				kernel_size: z.number(),
			}),
		},
		{
			type: "normalize",
			title: "Normalization",
			description:
				"Data transformation process that aligns data values to a common scale",
			icon: <Binary />,
			id: "normalization-1",
			metadata: {
				range: {
					type: "Object",
					value: {
						min: { type: "Number", value: 0 },
						max: { type: "Number", value: 255 },
					},
				},
			},
			previewImg: [
				{
					type: "normalize",
					params: [
						(findById(fields, "normalization-1")?.metadata as any)?.range?.value
							?.min?.value || 10,
						(findById(fields, "normalization-1")?.metadata as any)?.range?.value
							?.max?.value || 225,
						NORM_MINMAX,
						CV_8U,
					],
				},
			],
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "normalization-form",
						renderCustomInput({ control }) {
							return (
								<div className="flex gap-x-3">
									{["min", "max"].map((range) => (
										<TextFormItem
											number
											key={`normalizeRange-${range}`}
											className="w-1/2"
											label={`${range} range`}
											onChange={(e) => {
												onUpdateMetadata({
													id: "normalization-1",
													metadata: {
														range: {
															type: "Object",
															value: {
																[range]: {
																	type: "Number",
																	value: e as number,
																},
															},
														},
													},
												});
											}}
											value={
												(findById(fields, "normalization-1")?.metadata as any)
													?.range?.value?.[range]?.value
											}
										/>
									))}
								</div>
							);
						},
					},
					config: {},
				},
			],
			inputSchema: z.object({
				range: z.object({
					min: z.string(),
					max: z.string(),
				}),
			}),
		},
		{
			type: "log_trans",
			title: "Log transformation",
			description:
				"Data transformation method which it replaces each variable x with a log(x)",
			icon: <DraftingCompass />,
			id: "log-transformation-1",
			metadata: {
				log_trans: {
					type: "Boolean",
					value: false,
				},
			},
			previewImg:
				findById(fields, "log-transformation-1")?.metadata?.log_trans?.value !==
				false
					? [{ type: "logTransform" }]
					: [],
			inputField: [
				{
					template: "switch",
					element: {
						testDataId: "log-transformation-form",
						label: "Enable status",
						key: "log_trans-1",
						name: "log_trans",
						required: true,
					},
					config: {
						setValue: findById(fields, "log-transformation-1")?.metadata
							?.log_trans?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "log-transformation-1",
								metadata: {
									log_trans: {
										type: "Boolean",
										value: value as boolean,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				log_trans: z.boolean().default(false),
			}),
		},
		{
			type: "histogram_equalization",
			title: "Histogram Equalization",
			description: "improve pixel image contrast",
			icon: <DraftingCompass />,
			id: "histogram-equalization-1",
			metadata: {
				histogram_equalization: {
					type: "Boolean",
					value: false,
				},
			},
			previewImg:
				findById(fields, "histogram-equalization-1")?.metadata
					?.histogram_equalization?.value !== false
					? [{ type: "histEqualization" }]
					: [],
			inputField: [
				{
					template: "switch",
					element: {
						testDataId: "histogram-equalization-form",
						label: "Enable status",
						key: "histogram_equalization-1",
						name: "histogram_equalization",
						required: true,
					},
					config: {
						setValue: findById(fields, "histogram-equalization-1")?.metadata
							?.histogram_equalization?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "histogram-equalization-1",
								metadata: {
									histogram_equalization: {
										type: "Boolean",
										value: value as boolean,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				histogram_equalization: z.boolean().default(false),
			}),
		},
		{
			type: "sharpening",
			title: "Sharpening",
			description:
				"enhances the appearance of an image by making it look clearer",
			icon: <Cuboid />,
			id: "sharpening-1",
			metadata: {
				ratio: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "sharpen",
					params: [
						(findById(fields, "sharpening-1")?.metadata?.ratio
							?.value as number) || 1.5,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "sharpening-form",
						label: "Sharpen value",
						key: "sharpening-1",
						name: "sharpening",
						required: true,
					},
					config: {
						setValue:
							Number(
								findById(fields, "sharpening-1")?.metadata?.ratio?.value,
							) ?? undefined,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "sharpening-1",
								metadata: {
									ratio: {
										type: "Number",
										value: !Number.isNaN(value) ? (value as number) : null,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				ratio: z.number().min(0).default(0),
			}),
		},
		{
			type: "unsharp",
			title: "Unsharp Masking",
			description: "enhances the appearance of an image by unsharp masking",
			icon: <Cuboid />,
			id: "unsharp-1",
			metadata: {
				kernel_size: {
					type: "Number",
					value: 0,
				},
				intensity: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "unsharpMasking",
					params: [
						(findById(fields, "unsharp-1")?.metadata?.kernel_size
							?.value as number) || 7,
						(findById(fields, "unsharp-1")?.metadata?.intensity
							?.value as number) || 1.5,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "unsharp-form",
						label: "Kernal Size",
						key: "unsharp-1",
						name: "unsharp",
						required: true,
					},
					config: {
						setValue:
							Number(
								findById(fields, "unsharp-1")?.metadata?.kernel_size?.value,
							) ?? undefined,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "unsharp-1",
								metadata: {
									kernel_size: {
										type: "Number",
										value: !Number.isNaN(value) ? (value as number) : null,
									},
								},
							});
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "unsharp-form",
						label: "Intensity",
						key: "unsharp-1",
						name: "unsharp",
						required: true,
					},
					config: {
						setValue:
							Number(
								findById(fields, "unsharp-1")?.metadata?.intensity?.value,
							) ?? undefined,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "unsharp-1",
								metadata: {
									intensity: {
										type: "Number",
										value: !Number.isNaN(value) ? (value as number) : null,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				ratio: z.number().min(0).default(0),
			}),
		},
		{
			type: "laplacian",
			title: "Laplacian",
			description: "Laplacian edge detection kernel size.",
			icon: <Cuboid />,
			id: "laplacian-1",
			metadata: {
				laplacian: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "laplacian",
					params: [
						(findById(fields, "laplacian-1")?.metadata?.laplacian
							?.value as number) || 1.5,
						0,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "laplacian-form",
						label: "Laplacian value",
						key: "laplacian-1",
						name: "laplacian",
						required: true,
					},
					config: {
						setValue:
							Number(
								findById(fields, "laplacian-1")?.metadata?.laplacian?.value,
							) ?? undefined,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "laplacian-1",
								metadata: {
									laplacian: {
										type: "Number",
										value: !Number.isNaN(value) ? (value as number) : null,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				laplacian: z.number().min(0).default(0),
			}),
		},
		{
			type: "gaussian_blur",
			title: "Gaussian blur",
			id: "gaussian_blur-1",
			description: "Apply Gaussian blur with kernel size and sigma",
			icon: <IconBlur />,
			metadata: {
				kernel_size: {
					type: "Object",
					value: {
						x: {
							type: "Number",
							value: 0,
						},
						y: {
							type: "Number",
							value: 0,
						},
					},
				},
				sigma: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "gaussianBlur",
					params: [
						[
							Number(
								(
									findById(fields, "gaussian_blur-1")?.metadata?.kernel_size
										?.value as any
								)?.x?.value,
							) || 5,
							Number(
								(
									findById(fields, "gaussian_blur-1")?.metadata?.kernel_size
										?.value as any
								)?.y?.value,
							) || 5,
						],
						Number(
							(
								findById(fields, "gaussian_blur-1")?.metadata?.sigma
									?.value as any
							)?.sigma?.value,
						) || 1,
					],
				},
			],
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "gaussian_blur-form",
						renderCustomInput() {
							return (
								<div className="flex gap-x-3">
									{["x", "y"].map((axis) => (
										<TextFormItem
											number
											key={`gaussian_blur-${axis}`}
											className="w-1/2"
											label={axis.toLocaleUpperCase()}
											onChange={(e) => {
												onUpdateMetadata({
													id: "gaussian_blur-1",
													metadata: {
														kernel_size: {
															type: "Object",
															value: {
																[axis]: {
																	type: "Number",
																	value: e as number,
																},
															},
														},
													},
												});
											}}
											value={
												(findById(fields, "gaussian_blur-1")?.metadata as any)
													?.kernel_size?.value?.[axis]?.value
											}
										/>
									))}
								</div>
							);
						},
					},
					config: {},
				},
				{
					template: "number",
					element: {
						testDataId: "gaussian_blur-sigma-form",
						label: "Sigma",
						key: "gaussian_blur-1",
						name: "gaussian_blur",
						required: true,
					},
					config: {
						setValue: (
							findById(fields, "gaussian_blur-1")?.metadata?.blur?.value as any
						)?.sigma?.value as number,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "gaussian_blur-1",
								metadata: {
									blur: {
										type: "Object",
										value: {
											sigma: {
												type: "Number",
												value: value as number,
											},
										},
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				blur: z.object({
					kernel_size: z.number(),
					sigma: z.number(),
				}),
			}),
		},
		{
			type: "dilation",
			title: "Dilation",
			description: "Morphological dilation.",
			icon: <Cuboid />,
			id: "dilation-1",
			metadata: {
				dilation: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "dilation",
					params: [
						(findById(fields, "dilation-1")?.metadata?.dilation
							?.value as number) || 3,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "dilation-form",
						label: "Dilation value",
						key: "dilation-1",
						name: "dilation",
						required: true,
					},
					config: {
						setValue:
							Number(
								findById(fields, "dilation-1")?.metadata?.dilation?.value,
							) ?? undefined,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "dilation-1",
								metadata: {
									dilation: {
										type: "Number",
										value: !Number.isNaN(value) ? (value as number) : null,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				dilation: z.number().min(0).default(0),
			}),
		},
		{
			type: "erosion",
			title: "Erosion",
			description: "Morphological erosion.",
			icon: <Cuboid />,
			id: "erosion-1",
			metadata: {
				erosion: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "erosion",
					params: [
						(findById(fields, "erosion-1")?.metadata?.erosion
							?.value as number) || 3,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "erosion-form",
						label: "Erosion value",
						key: "erosion-1",
						name: "erosion",
						required: true,
					},
					config: {
						setValue:
							Number(findById(fields, "erosion-1")?.metadata?.erosion?.value) ??
							undefined,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "erosion-1",
								metadata: {
									erosion: {
										type: "Number",
										value: !Number.isNaN(value) ? (value as number) : null,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				erosion: z.number().min(0).default(0),
			}),
		},
		{
			type: "opening",
			title: "Opening",
			description: "Morphological opening.",
			icon: <Cuboid />,
			id: "opening-1",
			metadata: {
				opening: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "opening",
					params: [
						(findById(fields, "opening-1")?.metadata?.opening
							?.value as number) || 3,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "opening-form",
						label: "Opening value",
						key: "opening-1",
						name: "opening",
						required: true,
					},
					config: {
						setValue:
							Number(findById(fields, "opening-1")?.metadata?.opening?.value) ??
							undefined,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "opening-1",
								metadata: {
									opening: {
										type: "Number",
										value: !Number.isNaN(value) ? (value as number) : null,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				opening: z.number().min(0).default(0),
			}),
		},
		{
			type: "closing",
			title: "Closing",
			description: "Morphological closing.",
			icon: <Cuboid />,
			id: "closing-1",
			metadata: {
				closing: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "closing",
					params: [
						(findById(fields, "closing-1")?.metadata?.closing
							?.value as number) || 3,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "closing-form",
						label: "Closing value",
						key: "closing-1",
						name: "closing",
						required: true,
					},
					config: {
						setValue:
							Number(findById(fields, "closing-1")?.metadata?.closing?.value) ??
							undefined,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "closing-1",
								metadata: {
									closing: {
										type: "Number",
										value: !Number.isNaN(value) ? (value as number) : null,
									},
								},
							});
						},
					},
				},
			],
			inputSchema: z.object({
				closing: z.number().min(0).default(0),
			}),
		},
	];
};
