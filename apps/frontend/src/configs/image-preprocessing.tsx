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
	Axis3d,
	Crop,
	FlipHorizontal2,
	RotateCcw,
	Scaling,
} from "lucide-react";
import { type ChangeEvent, EventHandler } from "react";
import { z } from "zod";

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
						renderCustomInput({ control }) {
							return (
								<FormField
									control={control}
									name="size.x"
									render={({ field: { onChange, value } }) => (
										<div className="flex gap-x-3">
											<TextFormItem
												className="w-1/2"
												label="X"
												onChange={(e) => {
													onUpdateMetadata({
														id: "resizing-1",
														metadata: {
															size: {
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
													(findById(fields, "resizing-1")?.metadata as any)
														?.size?.value?.x?.value
												}
											/>
											<TextFormItem
												className="w-1/2"
												label="Y"
												onChange={(e) => {
													onUpdateMetadata({
														id: "resizing-1",
														metadata: {
															size: {
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
													(findById(fields, "resizing-1")?.metadata as any)
														?.size?.value?.y?.value
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
				position: { type: "String", value: "" },
			},
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "cropping-form",
						renderCustomInput({ control }) {
							return (
								<FormField
									control={control}
									key="cropping-size-1"
									name="size.x"
									render={({ field: { onChange, value } }) => (
										<div className="flex gap-x-3">
											<FormItem className={cn("w-1/2")}>
												<FormLabel>X</FormLabel>
												<FormControl>
													<Input
														type="text"
														onChange={(e) => {
															onUpdateMetadata({
																id: "cropping-1",
																metadata: {
																	size: {
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
															(findById(fields, "cropping-1")?.metadata as any)
																?.size?.value?.x?.value
														}
														placeholder="0"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
											<FormItem className={cn("w-1/2")}>
												<FormLabel>Y</FormLabel>
												<FormControl>
													<Input
														type="text"
														onChange={(e) =>
															onUpdateMetadata({
																id: "cropping-1",
																metadata: {
																	size: {
																		type: "Object",
																		value: {
																			y: {
																				type: "Number",
																				value: Number(e.target.value),
																			},
																		},
																	},
																},
															})
														}
														value={
															(findById(fields, "cropping-1")?.metadata as any)
																?.size?.value?.y?.value
														}
														placeholder="0"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
							);
						},
					},
					config: {},
				},
				{
					template: "select",
					element: {
						label: "Position",
						key: "crop-position-1",
						testDataId: "crop-position",
						placeholder: "select position",
						name: "position",
					},
					config: {
						setValue: findById(fields, "cropping-1")?.metadata?.position?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "cropping-1",
								metadata: {
									position: {
										type: "String",
										value: String(value),
									},
								},
							});
						},
						options: {
							group: false,
							list: [
								{ value: "center", label: "Center" },
								{ value: "random", label: "Random" },
							],
						},
					},
				},
			],
			inputSchema: z.object({
				size: z.object({
					x: z.string(),
					y: z.string(),
				}),
				position: z.string(),
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
			type: "perspective",
			title: "Perspective Transformation",
			description: "Displays the final output",
			icon: <Axis3d />,
			id: "perspective-1",
			metadata: {
				source: {
					type: "Object",
					value: {
						"top-left": { type: "Number", value: 0 },
						"top-right": { type: "Number", value: 0 },
						"bottom-left": { type: "Number", value: 0 },
						"bottom-right": { type: "Number", value: 0 },
					},
				},
				destination: {
					type: "Object",
					value: {
						"top-left": { type: "Number", value: 0 },
						"top-right": { type: "Number", value: 0 },
						"bottom-left": { type: "Number", value: 0 },
						"bottom-right": { type: "Number", value: 0 },
					},
				},
			},
			/*
    { source: {
     top-left: 0}
     }
      */
			inputSchema: z.object({
				source: z.object({
					"top-left": z.string(),
					"top-right": z.string(),
					"bottom-left": z.string(),
					"bottom-right": z.string(),
				}),
				destination: z.object({
					"top-left": z.string(),
					"top-right": z.string(),
					"bottom-left": z.string(),
					"bottom-right": z.string(),
				}),
			}),
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "perspective-form",
						renderCustomInput({ control }) {
							return (
								<FormField
									control={control}
									name="source"
									render={({ field: { onChange, value } }) => (
										<div className="flex flex-col">
											<ContentHeader>Source Point</ContentHeader>
											<div className="flex gap-x-3">
												<TextFormItem
													label="Top-left"
													className="w-1/2"
													onChange={(e) => {
														onUpdateMetadata({
															id: "perspective-1",
															metadata: {
																source: {
																	type: "Object",
																	value: {
																		"top-left": {
																			type: "Number",
																			value: Number(e.target.value),
																		},
																	},
																},
															},
														});
													}}
													value={
														(findById(fields, "perspective-1")?.metadata as any)
															?.source?.value?.["top-left"]?.value || undefined
													}
													placeholder="0"
												/>
												<FormItem className={cn("w-1/2")}>
													<FormLabel>Top-right</FormLabel>
													<FormControl>
														<Input
															type="text"
															onChange={(e) =>
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		source: {
																			type: "Object",
																			value: {
																				"top-right": {
																					type: "Number",
																					value: Number(e.target.value),
																				},
																			},
																		},
																	},
																})
															}
															value={
																(
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.source?.value?.["top-right"]?.value ||
																undefined
															}
															placeholder="0"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											</div>
											<div className="flex gap-x-3">
												<FormItem className={cn("w-1/2")}>
													<FormLabel>Bottom-left</FormLabel>
													<FormControl>
														<Input
															type="text"
															onChange={(e) => {
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		source: {
																			type: "Object",
																			value: {
																				"bottom-left": {
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
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.source?.value?.["bottom-left"]?.value ||
																undefined
															}
															placeholder="0"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
												<FormItem className={cn("w-1/2")}>
													<FormLabel>Bottom-right</FormLabel>
													<FormControl>
														<Input
															type="text"
															onChange={(e) =>
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		source: {
																			type: "Object",
																			value: {
																				"bottom-right": {
																					type: "Number",
																					value: Number(e.target.value),
																				},
																			},
																		},
																	},
																})
															}
															value={
																(
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.source?.value?.["bottom-right"]?.value ||
																undefined
															}
															placeholder="0"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											</div>
										</div>
									)}
								/>
							);
						},
					},
					config: {},
				},
				{
					template: "custom",
					element: {
						testDataId: "perspective-form",
						renderCustomInput({ control }) {
							return (
								<FormField
									control={control}
									name="destination"
									render={({ field: { onChange, value } }) => (
										<div className="flex flex-col">
											<ContentHeader>Destination Point</ContentHeader>
											<div className="flex gap-x-3">
												<FormItem className={cn("w-1/2")}>
													<FormLabel>Top-left</FormLabel>
													<FormControl>
														<Input
															type="text"
															onChange={(e) => {
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		destination: {
																			type: "Object",
																			value: {
																				"top-left": {
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
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.destination?.value?.["top-left"]?.value ||
																undefined
															}
															placeholder="0"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
												<FormItem className={cn("w-1/2")}>
													<FormLabel>Top-right</FormLabel>
													<FormControl>
														<Input
															type="text"
															onChange={(e) =>
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		destination: {
																			type: "Object",
																			value: {
																				"top-right": {
																					type: "Number",
																					value: Number(e.target.value),
																				},
																			},
																		},
																	},
																})
															}
															value={
																(
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.destination?.value?.["top-right"]?.value ||
																undefined
															}
															placeholder="0"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											</div>

											<div className="flex gap-x-3">
												<FormItem className={cn("w-1/2")}>
													<FormLabel>Bottom-left</FormLabel>
													<FormControl>
														<Input
															type="text"
															onChange={(e) => {
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		destination: {
																			type: "Object",
																			value: {
																				"bottom-left": {
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
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.destination?.value?.["bottom-left"]?.value ||
																undefined
															}
															placeholder="0"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
												<FormItem className={cn("w-1/2")}>
													<FormLabel>Bottom-right</FormLabel>
													<FormControl>
														<Input
															type="text"
															onChange={(e) =>
																onUpdateMetadata({
																	id: "perspective-1",
																	metadata: {
																		destination: {
																			type: "Object",
																			value: {
																				"bottom-right": {
																					type: "Number",
																					value: Number(e.target.value),
																				},
																			},
																		},
																	},
																})
															}
															value={
																(
																	findById(fields, "perspective-1")
																		?.metadata as any
																)?.destination?.value?.["bottom-right"]
																	?.value || undefined
															}
															placeholder="0"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											</div>
										</div>
									)}
								/>
							);
						},
					},
					config: {},
				},
			],
		},
	];
};
