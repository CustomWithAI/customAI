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
} from "lucide-react";
import type { ChangeEvent } from "react";
import { z } from "zod";

const Corner = ["top-left", "top-right", "bottom-left", "bottom-right"];

export const node = (
	fields: DragColumn<z.ZodRawShape>[],
	onUpdateMetadata: (payload: {
		id: string;
		metadata: Metadata;
	}) => void,
): DragColumn[] => {
	return [
		{
			type: "resizing",
			title: "Resizing Node",
			description: "Evaluates a condition and routes the flow",
			icon: <Scaling />,
			id: "resizing-1",
			metadata: {
				size: {
					type: "Object",
					value: {
						x: { type: "Number", value: 1 },
						y: { type: "Number", value: 1 },
					},
				},
			},
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
																	value: Number(e.target.value),
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
			type: "cropping",
			title: "Cropping Node",
			description: "Processes the input value",
			icon: <Crop />,
			id: "cropping-1",
			metadata: {
				size: {
					type: "Object",
					value: {
						x: { type: "Number", value: 0 },
						y: { type: "Number", value: 0 },
					},
				},
				crop_position: {
					type: "Object",
					value: {
						x: { type: "Number", value: 0 },
						y: { type: "Number", value: 0 },
					},
				},
			},
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "cropping-form",
						renderCustomInput() {
							return (
								<>
									<ContentHeader>Cropping Size</ContentHeader>
									<div className="flex gap-x-3">
										{["x", "y"].map((axis) => (
											<TextFormItem
												key={`cropping-${axis}`}
												className="w-1/2"
												label="X"
												onChange={(e) => {
													onUpdateMetadata({
														id: "cropping-1",
														metadata: {
															size: {
																type: "Object",
																value: {
																	[axis]: {
																		type: "Number",
																		value: Number(e.target.value),
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
									<ContentHeader>Cropping Position</ContentHeader>
									<div className="flex gap-x-3">
										{["x", "y"].map((axis) => (
											<TextFormItem
												key={`crop_position-${axis}`}
												className="w-1/2"
												label="Crop position x"
												onChange={(e) => {
													onUpdateMetadata({
														id: "cropping-1",
														metadata: {
															crop_position: {
																type: "Object",
																value: {
																	[axis]: {
																		type: "Number",
																		value: Number(e.target.value),
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
			type: "rotation",
			title: "Rotation Node",
			description: "Displays the final output",
			icon: <RotateCcw />,
			id: "rotation-1",
			metadata: {
				angle: { type: "String", value: "" },
			},
			inputField: [
				{
					template: "text",
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
									angle: {
										type: "String",
										value: String(
											(value as ChangeEvent<HTMLInputElement>).target.value,
										),
									},
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
			type: "flipping",
			title: "Flipping Node",
			description: "Displays the final output",
			icon: <FlipHorizontal2 />,
			id: "flipping-1",
			metadata: {
				direction: { type: "String", value: "" },
			},
			inputField: [
				{
					template: "text",
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
										type: "String",
										value: String(
											(value as ChangeEvent<HTMLInputElement>).target.value,
										),
									},
								},
							});
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
			description:
				"Data transformation method which it replaces each variable x with a log(x)",
			icon: <Droplet />,
			id: "grayscale-1",
			metadata: {
				gray_scale: {
					type: "Boolean",
					value: false,
				},
			},
			inputField: [
				{
					template: "switch",
					element: {
						testDataId: "grayscale-form",
						label: "Enable status",
						key: "log_trans-1",
						name: "log_trans",
						required: true,
					},
					config: {
						setValue: findById(fields, "grayscale-1")?.metadata?.gray_scale
							?.value as boolean,
						setOnChange: (value: unknown) => {
							console.log(value);
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
			type: "perspective",
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
								y: { type: "Number", value: 0 },
							},
						},
						"bottom-left": {
							type: "Object",
							value: {
								x: { type: "Number", value: 0 },
								y: { type: "Number", value: 0 },
							},
						},
						"bottom-right": {
							type: "Object",
							value: {
								x: { type: "Number", value: 0 },
								y: { type: "Number", value: 0 },
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
								x: { type: "Number", value: 0 },
								y: { type: "Number", value: 0 },
							},
						},
						"top-right": {
							type: "Object",
							value: {
								x: { type: "Number", value: 0 },
								y: { type: "Number", value: 0 },
							},
						},
						"bottom-left": {
							type: "Object",
							value: {
								x: { type: "Number", value: 0 },
								y: { type: "Number", value: 0 },
							},
						},
						"bottom-right": {
							type: "Object",
							value: {
								x: { type: "Number", value: 0 },
								y: { type: "Number", value: 0 },
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
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "perspective-form",
						renderCustomInput({ control }) {
							return (
								<div className="flex flex-col">
									<ContentHeader>Source Point</ContentHeader>
									<div className="grid-cols-2 gap-x-3">
										{Array.from({ length: 4 }, () => ["x", "y"]).map(
											(corner, index) => (
												<div
													className="w-full flex gap-x-3"
													key={`source-${index}`}
												>
													{corner.map((axis) => (
														<TextFormItem
															key={`source-${axis}`}
															label={Corner[index]}
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
																							value: Number(e.target.value),
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
																)?.source?.value?.["top-left"]?.value ||
																undefined
															}
															placeholder="0"
														/>
													))}
												</div>
											),
										)}
									</div>
									<ContentHeader className="mt-4">
										Destination Point
									</ContentHeader>
									<div className="grid-cols-2 gap-x-3">
										{Array.from({ length: 4 }, () => ["x", "y"]).map(
											(corner, index) => (
												<div
													className="w-full flex gap-x-3"
													key={`source-${index}`}
												>
													{corner.map((axis) => (
														<TextFormItem
															key={`source-${axis}`}
															label={Corner[index]}
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
																							value: Number(e.target.value),
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
																)?.source?.value?.["top-left"]?.value ||
																undefined
															}
															placeholder="0"
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
			type: "percentage",
			title: "Percentage Tresholding",
			description: "Displays the final output",
			icon: <Percent />,
			id: "percentage-1",
			metadata: {
				percentage: { type: "Number", value: 0 },
			},
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
			type: "mean-filtering",
			title: "Mean Filtering",
			description: "Evaluates a condition and routes the flow",
			icon: <ArrowDownWideNarrow />,
			id: "mean-filtering-1",
			metadata: {
				kernel_size: {
					type: "Object",
					value: {
						x: { type: "Number", value: 1 },
						y: { type: "Number", value: 1 },
					},
				},
			},
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "mean-filtering-form",
						renderCustomInput({ control }) {
							return (
								<FormField
									control={control}
									name="kernel_size.x"
									render={({ field: { onChange, value } }) => (
										<div className="flex gap-x-3">
											<TextFormItem
												className="w-1/2"
												label="X"
												onChange={(e) => {
													onUpdateMetadata({
														id: "mean-filtering-1",
														metadata: {
															kernel_size: {
																type: "Object",
																value: {
																	x: {
																		type: "Number",
																		value: Number(e.target.value),
																	},
																},
															},
														},
													});
												}}
												value={
													(
														findById(fields, "mean-filtering-1")
															?.metadata as any
													)?.kernel_size?.value?.x?.value
												}
											/>
											<TextFormItem
												className="w-1/2"
												label="Y"
												onChange={(e) => {
													onUpdateMetadata({
														id: "mean-filtering-1",
														metadata: {
															kernel_size: {
																type: "Object",
																value: {
																	y: {
																		type: "Number",
																		value: Number(e.target.value),
																	},
																},
															},
														},
													});
												}}
												value={
													(
														findById(fields, "mean-filtering-1")
															?.metadata as any
													)?.kernel_size?.value?.y?.value
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
			type: "median-filtering",
			title: "Median Filtering",
			description: "Evaluates a condition and routes the flow",
			icon: <ArrowDownWideNarrow />,
			id: "median-filtering-1",
			metadata: {
				kernel_size: {
					type: "Object",
					value: {
						x: { type: "Number", value: 1 },
						y: { type: "Number", value: 1 },
					},
				},
			},
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "median-filtering-form",
						renderCustomInput({ control }) {
							return (
								<FormField
									control={control}
									name="kernel_size.x"
									render={({ field: { onChange, value } }) => (
										<div className="flex gap-x-3">
											<TextFormItem
												className="w-1/2"
												label="X"
												onChange={(e) => {
													onUpdateMetadata({
														id: "median-filtering-1",
														metadata: {
															kernel_size: {
																type: "Object",
																value: {
																	x: {
																		type: "Number",
																		value: Number(e.target.value),
																	},
																},
															},
														},
													});
												}}
												value={
													(
														findById(fields, "median-filtering-1")
															?.metadata as any
													)?.kernel_size?.value?.x?.value
												}
											/>
											<TextFormItem
												className="w-1/2"
												label="Y"
												onChange={(e) => {
													onUpdateMetadata({
														id: "median-filtering-1",
														metadata: {
															kernel_size: {
																type: "Object",
																value: {
																	y: {
																		type: "Number",
																		value: Number(e.target.value),
																	},
																},
															},
														},
													});
												}}
												value={
													(
														findById(fields, "median-filtering-1")
															?.metadata as any
													)?.kernel_size?.value?.y?.value
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
			type: "normalization",
			title: "Normalization",
			description:
				"Data transformation process that aligns data values to a common scale",
			icon: <Binary />,
			id: "normalization-1",
			metadata: {
				range: {
					type: "Object",
					value: {
						min: { type: "Number", value: 1 },
						max: { type: "Number", value: 1 },
					},
				},
			},
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
																	value: Number(e.target.value),
																},
															},
														},
													},
												});
											}}
											value={
												(findById(fields, "normalization-1")?.metadata as any)
													?.kernel_size?.value?.x?.value
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
			type: "log-transformation",
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
							console.log(value);
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
			type: "histogram-equalization",
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
							console.log(value);
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
			inputField: [
				{
					template: "slider",
					element: {
						testDataId: "sharpening-form",
						label: "Sharpen value",
						key: "histogram_equalization-1",
						name: "histogram_equalization",
						required: true,
					},
					config: {
						options: {
							max: 1,
							step: 0.1,
						},
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
	];
};
