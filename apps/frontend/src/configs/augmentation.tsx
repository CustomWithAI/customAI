import { TextFormItem } from "@/components/builder/form-utils";
import { ContentHeader } from "@/components/typography/text";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import { findById } from "@/utils/findId";
import {
	IconBlur,
	IconBrightness,
	IconColorPicker,
	IconTransform,
} from "@tabler/icons-react";
import { INTER_LINEAR, Size } from "@techstark/opencv-js";
import { AudioWaveform, Crop, Droplet, Eraser, Scaling, X } from "lucide-react";
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
			type: "grayscale",
			title: "Gray scale",
			description: "Convert image to grayscale",
			icon: <Droplet />,
			id: "grayscale-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
			},
			previewImg:
				findById(fields, "grayscale-1")?.metadata?.probability?.value !== false
					? [{ type: "grayscale" }]
					: [],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "grayscale-form",
						label: "Probability",
						key: "grayscale-1",
						name: "grayscale",
						required: true,
					},
					config: {
						setValue: findById(fields, "grayscale-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "grayscale-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
			],
			inputSchema: z.object({
				probability: z.number().positive(),
			}),
		},
		{
			type: "resizing",
			title: "Resizing Node",
			description: "Resize image to a specific width and height",
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
			previewImg: [
				{
					type: "resizing",
					params: [
						(findById(fields, "resizing-1")?.metadata as any)?.size?.value?.x
							?.value,
						(findById(fields, "resizing-1")?.metadata as any)?.size?.value?.y
							?.value,
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
			type: "cropping",
			title: "Cropping Node",
			description: "Crop a region from the image (x, y, width, height)",
			icon: <Crop />,
			id: "cropping-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
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
					template: "sliderInput",
					element: {
						testDataId: "cropping-form",
						label: "Probability",
						key: "cropping-1",
						name: "cropping",
						required: true,
					},
					config: {
						setValue: findById(fields, "cropping-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "cropping-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "custom",
					element: {
						testDataId: "cropping-form",
						renderCustomInput() {
							return (
								<>
									<ContentHeader className="mt-4">Cropping Size</ContentHeader>
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
									<ContentHeader className="mt-4">
										Cropping Position
									</ContentHeader>
									<div className="flex gap-x-3">
										{["x", "y"].map((axis) => (
											<TextFormItem
												number
												key={`crop_position-${axis}`}
												className="w-1/2"
												label={`Crop position ${axis.toUpperCase()}`}
												onChange={(e) => {
													onUpdateMetadata({
														id: "cropping-1",
														metadata: {
															crop_position: {
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
				probability: z.number().positive(),
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
			title: "Rotation",
			description: "Rotate image by a random angle within a range",
			icon: <Droplet />,
			id: "rotation-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				rotation: {
					type: "Number",
					value: 0,
				},
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
					template: "sliderInput",
					element: {
						testDataId: "rotation-form",
						label: "Probability",
						key: "rotation-1",
						name: "rotation",
						required: true,
					},
					config: {
						setValue: findById(fields, "rotation-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "rotation-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							max: 1,
							min: 0,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "rotation-form",
						label: "Rotation",
						key: "rotation-1",
						name: "rotation",
						required: true,
					},
					config: {
						setValue: findById(fields, "rotation-1")?.metadata?.rotation
							?.value as boolean,
						setOnChange: (value: unknown) => {
							console.log(value);
							onUpdateMetadata({
								id: "rotation-1",
								metadata: {
									rotation: {
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
				probability: z.number().positive(),
				rotation: z.number().default(0),
			}),
		},
		{
			type: "flip",
			title: "Flip",
			description: "Flip image horizontally, vertically, or both",
			icon: <Droplet />,
			id: "flip-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				flip: {
					type: "Number",
					value: 0,
				},
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
					template: "sliderInput",
					element: {
						testDataId: "flip-form",
						label: "Probability",
						key: "flip-1",
						name: "flip",
						required: true,
					},
					config: {
						setValue: findById(fields, "flip-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							console.log(value);
							onUpdateMetadata({
								id: "flip-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "select",
					element: {
						testDataId: "flip-form",
						label: "flip",
						key: "flip-1",
						name: "flip",
						required: true,
					},
					config: {
						options: {
							group: false,
							list: [
								{
									label: "horizontal",
									value: 0,
								},
								{
									label: "vertical",
									value: 1,
								},
								{
									label: "both",
									value: -1,
								},
							],
						},
						setValue: findById(fields, "flip-1")?.metadata?.flip
							?.value as boolean,
						setOnChange: (value: unknown) => {
							console.log(value);
							onUpdateMetadata({
								id: "flip-1",
								metadata: {
									flip: {
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
				probability: z.number().positive(),
				flip: z.number().default(0),
			}),
		},
		{
			type: "translate",
			title: "Translate",
			description: "Shift image along x and y axes",
			icon: <IconTransform />,
			id: "translate-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				size: {
					type: "Object",
					value: {
						x: { type: "Number", value: 1 },
						y: { type: "Number", value: 1 },
					},
				},
			},
			previewImg: [
				{
					type: "translate",
					params: [
						((findById(fields, "translate-1")?.metadata as any)?.size?.value?.x
							?.value as number) || 50,
						(findById(fields, "translate-1")?.metadata as any)?.size?.value?.y
							?.value || 50,
					],
				},
			],
			inputField: [
				{
					template: "custom",
					element: {
						testDataId: "translate-form",
						renderCustomInput() {
							return (
								<div className="flex gap-x-3">
									{["x", "y"].map((axis) => (
										<TextFormItem
											number
											key={`translate-${axis}`}
											className="w-1/2"
											label={axis.toLocaleUpperCase()}
											onChange={(e) => {
												onUpdateMetadata({
													id: "translate-1",
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
												(findById(fields, "translate-1")?.metadata as any)?.size
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
				probability: z.number().positive(),
				size: z.object({
					x: z.string(),
					y: z.string(),
				}),
			}),
		},
		{
			type: "scale",
			title: "Scale",
			description: "Scale image by a factor",
			icon: <Scaling />,
			id: "scale-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				scale: {
					type: "Object",
					value: {
						x: { type: "Number", value: 1 },
						y: { type: "Number", value: 1 },
					},
				},
			},
			previewImg: [
				{
					type: "scale",
					params: [
						Number(
							(findById(fields, "scale-1")?.metadata as any)?.size?.value?.x
								?.value,
						) || 50,
						Number(
							(findById(fields, "scale-1")?.metadata as any)?.size?.value?.y
								?.value,
						) || 50,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "scale-form",
						label: "Probability",
						key: "scale-1",
						name: "scale",
						required: true,
					},
					config: {
						setValue: findById(fields, "scale-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "scale-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							max: 1,
							min: 0,
							step: 0.1,
						},
					},
				},
				{
					template: "custom",
					element: {
						testDataId: "scale-form",
						renderCustomInput() {
							return (
								<div className="flex gap-x-3">
									{["x", "y"].map((axis) => (
										<TextFormItem
											number
											key={`scale-${axis}`}
											className="w-1/2"
											label={axis.toLocaleUpperCase()}
											onChange={(e) => {
												onUpdateMetadata({
													id: "scale-1",
													metadata: {
														scale: {
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
												(findById(fields, "scale-1")?.metadata as any)?.scale
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
				probability: z.number().positive(),
				scale: z.object({
					x: z.string(),
					y: z.string(),
				}),
			}),
		},
		{
			type: "brightness",
			title: "Brightness",
			description: "Adjust image brightness",
			icon: <IconBrightness />,
			id: "brightness-1",
			metadata: {
				min: {
					type: "Number",
					value: 0,
				},
				max: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "brightness",
					params: [
						Number(findById(fields, "brightness-1")?.metadata?.max?.value || 3),
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "brightness-form",
						label: "Probability",
						key: "brightness-1",
						name: "brightness",
						required: true,
					},
					config: {
						setValue: findById(fields, "brightness-1")?.metadata?.min
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "brightness-1",
								metadata: {
									min: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: -1,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "sliderInput",
					element: {
						testDataId: "brightness-form",
						label: "Brightness",
						key: "brightness-1",
						name: "brightness",
						required: true,
					},
					config: {
						setValue: findById(fields, "brightness-1")?.metadata?.max
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "brightness-1",
								metadata: {
									max: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: -1,
							max: 1,
							step: 0.1,
						},
					},
				},
			],
			inputSchema: z.object({
				min: z.number(),
				max: z.number(),
			}),
		},
		{
			type: "contrast_stretching",
			title: "Contrast Stretching",
			description: "Normalize contrast using min-max scaling",
			icon: <IconBrightness />,
			id: "contrast_stretching-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				min: {
					type: "Number",
					value: 0,
				},
				max: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "contrast_stretching",
					params: [
						Number(
							findById(fields, "contrast_stretching-1")?.metadata?.min?.value ||
								45,
						),
						Number(
							findById(fields, "contrast_stretching-1")?.metadata?.max?.value ||
								45,
						),
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "contrast_stretching-form",
						label: "Probability",
						key: "contrast_stretching-1",
						name: "contrast_stretching",
						required: true,
					},
					config: {
						setValue: findById(fields, "contrast_stretching-1")?.metadata
							?.probability?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "contrast_stretching-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
					},
				},
				{
					template: "slider",
					element: {
						testDataId: "contrast_stretching-form",
						label: "Probability",
						key: "contrast_stretching-1",
						name: "contrast_stretching",
						required: true,
					},
					config: {
						setValue: findById(fields, "contrast_stretching-1")?.metadata?.min
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "contrast_stretching-1",
								metadata: {
									min: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: -1,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "sliderInput",
					element: {
						testDataId: "contrast_stretching-form",
						label: "Contrast Stretching Scale",
						key: "contrast_stretching-1",
						name: "contrast_stretching",
						required: true,
					},
					config: {
						setValue: findById(fields, "contrast_stretching-1")?.metadata?.max
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "contrast_stretching-1",
								metadata: {
									max: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: -1,
							max: 1,
							step: 0.1,
						},
					},
				},
			],
			inputSchema: z.object({
				probability: z.number().positive(),
				min: z.number(),
				max: z.number(),
			}),
		},
		{
			type: "histogram_equalization",
			title: "Hist Equalization",
			description: "Apply histogram equalization to improve contrast",
			icon: <IconBrightness />,
			id: "histogram_equalization-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
			},
			previewImg:
				findById(fields, "histogram_equalization-1")?.metadata?.probability
					?.value !== 0
					? [{ type: "histEqualization" }]
					: [],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "histogram_equalization-form",
						label: "Probability",
						key: "histogram_equalization-1",
						name: "histogram_equalization",
						required: true,
					},
					config: {
						setValue: findById(fields, "histogram_equalization-1")?.metadata
							?.probability?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "histogram_equalization-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
			],
			inputSchema: z.object({
				probability: z.number().positive(),
			}),
		},
		{
			type: "adaptive_equalization",
			title: "Adaptive Equalization",
			description: "Apply CLAHE for localized contrast enhancement",
			icon: <IconBrightness />,
			id: "adaptive_equalization-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "adaptive_equalization",
					params: [
						Number(
							findById(fields, "adaptive_equalization-1")?.metadata?.probability
								?.value,
						) || 10,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "adaptive_equalization-form",
						label: "Probability",
						key: "prob_adaptive_equalization-1",
						name: "adaptive_equalization",
						required: true,
					},
					config: {
						setValue: findById(fields, "adaptive_equalization-1")?.metadata
							?.probability?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "adaptive_equalization-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "adaptive_equalization-form",
						label: "Scale",
						key: "scale_adaptive_equalization-1",
						name: "adaptive_equalization",
						required: true,
					},
					config: {
						setValue: findById(fields, "adaptive_equalization-1")?.metadata
							?.config?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "adaptive_equalization-1",
								metadata: {
									config: {
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
				probability: z.number().positive(),
				config: z.number(),
			}),
		},
		{
			type: "saturation",
			title: "Saturation",
			description: "Adjust color saturation",
			icon: <IconColorPicker />,
			id: "saturation-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "saturation",
					params: [
						Number(
							findById(fields, "saturation-1")?.metadata?.probability?.value,
						) || 10,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "saturation-form",
						label: "Probability",
						key: "saturation-1",
						name: "saturation",
						required: true,
					},
					config: {
						setValue: findById(fields, "saturation-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "saturation-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "saturation-form",
						label: "Scale",
						key: "saturation-1",
						name: "saturation",
						required: true,
					},
					config: {
						setValue: findById(fields, "saturation-1")?.metadata?.config
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "saturation-1",
								metadata: {
									config: {
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
				probability: z.number().positive(),
				config: z.number(),
			}),
		},
		{
			type: "hue",
			title: "Hue",
			description: "Adjust color hue values",
			icon: <IconColorPicker />,
			id: "hue-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "hue",
					params: [
						Number(findById(fields, "hue-1")?.metadata?.probability?.value) ||
							10,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "hue-form",
						label: "Probability",
						key: "hue-1",
						name: "hue",
						required: true,
					},
					config: {
						setValue: findById(fields, "hue-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "hue-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "hue-form",
						label: "Scale",
						key: "hue-1",
						name: "hue",
						required: true,
					},
					config: {
						setValue: findById(fields, "hue-1")?.metadata?.config
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "hue-1",
								metadata: {
									config: {
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
				probability: z.number().positive(),
				config: z.number(),
			}),
		},
		{
			type: "gamma",
			title: "Gamma",
			description: "Adjust color gamma correction",
			icon: <IconColorPicker />,
			id: "gamma-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "gamma",
					params: [
						Number(findById(fields, "gamma-1")?.metadata?.probability?.value) ||
							10,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "gamma-form",
						label: "Probability",
						key: "gamma-1",
						name: "gamma",
						required: true,
					},
					config: {
						setValue: findById(fields, "gamma-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "gamma-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "gamma-form",
						label: "Scale",
						key: "gamma-1",
						name: "gamma",
						required: true,
					},
					config: {
						setValue: findById(fields, "gamma-1")?.metadata?.config
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "gamma-1",
								metadata: {
									config: {
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
				probability: z.number().positive(),
				config: z.number(),
			}),
		},
		{
			type: "gaussian_blur",
			title: "Gaussian blur",
			id: "gaussian_blur-1",
			description: "Apply Gaussian blur with kernel size and sigma",
			icon: <IconBlur />,
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				blur: {
					type: "Object",
					value: {
						kernel_size: {
							type: "Number",
							value: 0,
						},
						sigma: {
							type: "Number",
							value: 0,
						},
					},
				},
			},
			previewImg: [
				{
					type: "gaussianBlur",
					params: [
						[
							((
								findById(fields, "gaussian_blur-1")?.metadata?.blur
									?.value as any
							)?.kernel_size?.value as number) || 5,
							((
								findById(fields, "gaussian_blur-1")?.metadata?.blur
									?.value as any
							)?.kernel_size?.value as number) || 5,
						],
						((findById(fields, "gaussian_blur-1")?.metadata?.blur?.value as any)
							?.sigma?.value as number) || 1,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "gaussian_blur-form",
						label: "Probability",
						key: "gaussian_blur-1",
						name: "gaussian_blur",
						required: true,
					},
					config: {
						setValue: findById(fields, "gaussian_blur-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "gaussian_blur-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "gaussian_blur-kernel_size-form",
						label: "Kernel size",
						key: "gaussian_blur-1",
						name: "gaussian_blur",
						required: true,
					},
					config: {
						setValue: (
							findById(fields, "gaussian_blur-1")?.metadata?.blur?.value as any
						)?.kernel_size?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "gaussian_blur-1",
								metadata: {
									blur: {
										type: "Object",
										value: {
											kernel_size: {
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
						)?.sigma?.value as boolean,
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
				probability: z.number().positive(),
				blur: z.object({
					kernel_size: z.number(),
					sigma: z.number(),
				}),
			}),
		},
		{
			type: "motion_blur",
			title: "Motion blur",
			id: "motion_blur-1",
			description: "Simulate motion blur",
			icon: <IconBlur />,
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				blur: {
					type: "Object",
					value: {
						kernel_size: {
							type: "Number",
							value: 0,
						},
						angle: {
							type: "Number",
							value: 0,
						},
					},
				},
			},
			previewImg: [
				{
					type: "motion_blur",
					params: [
						Number(
							(findById(fields, "motion_blur-1")?.metadata?.blur?.value as any)
								?.kernel_size?.value,
						) || 5,
						Number(
							(findById(fields, "motion_blur-1")?.metadata?.blur?.value as any)
								?.angle?.value,
						) || 45,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "motion_blur-form",
						label: "Probability",
						key: "motion_blur-1",
						name: "motion_blur",
						required: true,
					},
					config: {
						setValue: findById(fields, "motion_blur-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "motion_blur-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "motion_blur-kernel_size-form",
						label: "Kernel size",
						key: "motion_blur-1",
						name: "motion_blur",
						required: true,
					},
					config: {
						setValue: (
							findById(fields, "motion_blur-1")?.metadata?.blur?.value as any
						)?.kernel_size?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "motion_blur-1",
								metadata: {
									blur: {
										type: "Object",
										value: {
											kernel_size: {
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
				{
					template: "number",
					element: {
						testDataId: "motion_blur-angle-form",
						label: "Angle",
						key: "motion_blur-1",
						name: "motion_blur",
						required: true,
					},
					config: {
						setValue: (
							findById(fields, "motion_blur-1")?.metadata?.blur?.value as any
						)?.angle?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "motion_blur-1",
								metadata: {
									blur: {
										type: "Object",
										value: {
											angle: {
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
				probability: z.number().positive(),
				blur: z.object({
					kernel_size: z.number(),
					angle: z.number(),
				}),
			}),
		},
		{
			type: "zoom_blur",
			title: "Zoom Blur",
			description: "Apply zoom blur effect",
			icon: <IconColorPicker />,
			id: "zoom_blur-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Number",
					value: 0,
				},
			},
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "zoom_blur-form",
						label: "Probability",
						key: "zoom_blur-1",
						name: "zoom_blur",
						required: true,
					},
					config: {
						setValue: findById(fields, "zoom_blur-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "zoom_blur-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "zoom_blur-form",
						label: "Zoom Factor",
						key: "zoom_blur-1",
						name: "zoom_blur",
						required: true,
					},
					config: {
						setValue: findById(fields, "zoom_blur-1")?.metadata?.config
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "zoom_blur-1",
								metadata: {
									config: {
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
				probability: z.number().positive(),
				config: z.number(),
			}),
		},
		{
			type: "sharpening",
			title: "Sharpening",
			description: "Sharpen the image",
			icon: <IconColorPicker />,
			id: "sharpening-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [
				{
					type: "sharpen",
					params: [
						(findById(fields, "sharpening-1")?.metadata?.config
							?.value as number) || 1.5,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "sharpening-form",
						label: "Probability",
						key: "sharpening-1",
						name: "sharpening",
						required: true,
					},
					config: {
						setValue: findById(fields, "sharpening-1")?.metadata?.probability
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "sharpening-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "sharpening-form",
						label: "Zoom Factor",
						key: "sharpening-1",
						name: "sharpening",
						required: true,
					},
					config: {
						setValue: findById(fields, "sharpening-1")?.metadata?.config
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "sharpening-1",
								metadata: {
									config: {
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
				probability: z.number().positive(),
				config: z.number(),
			}),
		},
		{
			type: "gaussian_noise",
			title: "Gaussian Noise",
			description: "add gaussian noise to image.",
			icon: <AudioWaveform />,
			id: "gaussian_noise-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Object",
					value: {
						mean: {
							type: "Number",
							value: 0,
						},
						variance: {
							type: "Number",
							value: 0,
						},
					},
				},
			},
			previewImg: [
				{
					type: "gaussian_noise",
					params: [
						Number(
							(findById(fields, "gaussian_noise-1") as any)?.metadata?.config
								?.value?.mean?.value,
						) || 1.5,
						Number(
							(findById(fields, "gaussian_noise-1") as any)?.metadata?.config
								?.value?.variance?.value,
						) || 0.1,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "gaussian_noise-form",
						label: "Probability",
						key: "gaussian_noise-prob-1",
						name: "gaussian_noise",
						required: true,
					},
					config: {
						setValue: findById(fields, "gaussian_noise-1")?.metadata
							?.probability?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "gaussian_noise-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "gaussian_noise-form",
						label: "Mean",
						key: "gaussian_noise-mean-1",
						name: "gaussian_noise",
						required: true,
					},
					config: {
						setValue: (findById(fields, "gaussian_noise-1") as any)?.metadata
							?.config?.value?.mean?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "gaussian_noise-1",
								metadata: {
									config: {
										type: "Object",
										value: {
											mean: {
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
				{
					template: "number",
					element: {
						testDataId: "gaussian_noise-form",
						label: "Variance",
						key: "gaussian_noise-variance-1",
						name: "gaussian_noise",
						required: true,
					},
					config: {
						setValue: (findById(fields, "gaussian_noise-1") as any)?.metadata
							?.config?.value?.variance?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "gaussian_noise-1",
								metadata: {
									config: {
										type: "Object",
										value: {
											variance: {
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
				probability: z.number().positive(),
				config: z.object({
					mean: z.number().positive(),
					variance: z.number().positive(),
				}),
			}),
		},
		{
			type: "salt_pepper_noise",
			title: "Salt Pepper Noise",
			description: "add salt vs pepper noise to image.",
			icon: <AudioWaveform />,
			id: "salt_pepper_noise-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Object",
					value: {
						amount: {
							type: "Number",
							value: 0,
						},
						salt_pepper_ratio: {
							type: "Number",
							value: 0,
						},
					},
				},
			},
			previewImg: [
				{
					type: "salt_pepper_noise",
					params: [
						Number(
							(findById(fields, "salt_pepper_noise-1") as any)?.metadata?.config
								?.value?.amount?.value,
						) || 0.05,
						Number(
							(findById(fields, "salt_pepper_noise-1") as any)?.metadata?.config
								?.value?.salt_pepper_ratio?.value,
						) || 0.5,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "salt_pepper_noise-form",
						label: "Probability",
						key: "salt_pepper_noise-prob-1",
						name: "salt_pepper_noise",
						required: true,
					},
					config: {
						setValue: findById(fields, "salt_pepper_noise-1")?.metadata
							?.probability?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "salt_pepper_noise-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "salt_pepper_noise-form",
						label: "Amount",
						key: "salt_pepper_noise-amount-1",
						name: "salt_pepper_noise",
						required: true,
					},
					config: {
						setValue: (findById(fields, "salt_pepper_noise-1") as any)?.metadata
							?.config?.value?.amount?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "salt_pepper_noise-1",
								metadata: {
									config: {
										type: "Object",
										value: {
											amount: {
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
				{
					template: "number",
					element: {
						testDataId: "salt_pepper_noise-form",
						label: "Salt Vs Pepper Ratio",
						key: "salt_pepper_noise-salt_pepper_noise_ratio-1",
						name: "salt_pepper_noise",
						required: true,
					},
					config: {
						setValue: (findById(fields, "salt_pepper_noise-1") as any)?.metadata
							?.config?.value?.salt_pepper_ratio?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "salt_pepper_noise-1",
								metadata: {
									config: {
										type: "Object",
										value: {
											salt_pepper_ratio: {
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
				probability: z.number().positive(),
				config: z.object({
					amount: z.number().positive(),
					salt_pepper_ratio: z.number().positive(),
				}),
			}),
		},
		{
			type: "random_erasing",
			title: "Random Erasing",
			description: "Randomly erase parts of the image.",
			icon: <Eraser />,
			id: "random_erasing-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				region: {
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
						width: {
							type: "Number",
							value: 0,
						},
						height: {
							type: "Number",
							value: 0,
						},
					},
				},
			},
			previewImg: [
				{
					type: "random_erasing",
					params: [
						Number(
							(findById(fields, "random_erasing-1") as any)?.metadata?.region
								?.value?.x?.value,
						) || 30,
						Number(
							(findById(fields, "random_erasing-1") as any)?.metadata?.region
								?.value?.y?.value,
						) || 30,
						Number(
							(findById(fields, "random_erasing-1") as any)?.metadata?.region
								?.value?.width?.value,
						) || 30,
						Number(
							(findById(fields, "random_erasing-1") as any)?.metadata?.region
								?.value?.height?.value,
						) || 30,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "random_erasing-form",
						label: "Probability",
						key: "random_erasing-prob-1",
						name: "random_erasing",
						required: true,
					},
					config: {
						setValue: findById(fields, "random_erasing-1")?.metadata
							?.probability?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "random_erasing-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "random_erasing-form",
						label: "X",
						key: "random_erasing-alpha-1",
						name: "random_erasing",
						required: true,
					},
					config: {
						setValue: (findById(fields, "random_erasing-1") as any)?.metadata
							?.region?.value?.y?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "random_erasing-1",
								metadata: {
									region: {
										type: "Object",
										value: {
											x: {
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
				{
					template: "number",
					element: {
						testDataId: "random_erasing-form",
						label: "Y",
						key: "random_erasing-alpha-1",
						name: "random_erasing",
						required: true,
					},
					config: {
						setValue: (findById(fields, "random_erasing-1") as any)?.metadata
							?.region?.value?.y?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "random_erasing-1",
								metadata: {
									region: {
										type: "Object",
										value: {
											y: {
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
				{
					template: "number",
					element: {
						testDataId: "random_erasing-form",
						label: "Width",
						key: "random_erasing-alpha-1",
						name: "random_erasing",
						required: true,
					},
					config: {
						setValue: (findById(fields, "random_erasing-1") as any)?.metadata
							?.region?.value?.width?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "random_erasing-1",
								metadata: {
									region: {
										type: "Object",
										value: {
											width: {
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
				{
					template: "number",
					element: {
						testDataId: "random_erasing-form",
						label: "Height",
						key: "random_erasing-alpha-1",
						name: "random_erasing",
						required: true,
					},
					config: {
						setValue: (findById(fields, "random_erasing-1") as any)?.metadata
							?.region?.value?.height?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "random_erasing-1",
								metadata: {
									region: {
										type: "Object",
										value: {
											height: {
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
				probability: z.number().positive(),
				region: z.object({
					x: z.number().positive(),
					y: z.number().positive(),
					width: z.number().positive(),
					height: z.number().positive(),
				}),
			}),
		},
		{
			type: "elastic_distortion",
			title: "Elastic Distortion",
			description: "Apply elastic transformation.",
			icon: <AudioWaveform />,
			id: "elastic_distortion-1",
			metadata: {
				probability: {
					type: "Number",
					value: 0,
				},
				config: {
					type: "Object",
					value: {
						alpha: {
							type: "Number",
							value: 0,
						},
						sigma: {
							type: "Number",
							value: 0,
						},
					},
				},
			},
			previewImg: [
				{
					type: "elastic_distortion",
					params: [
						Number(
							(findById(fields, "elastic_distortion-1") as any)?.metadata
								?.config?.value?.alpha?.value,
						) || 0.05,
						Number(
							(findById(fields, "elastic_distortion-1") as any)?.metadata
								?.config?.value?.sigma?.value,
						) || 0.5,
					],
				},
			],
			inputField: [
				{
					template: "sliderInput",
					element: {
						testDataId: "elastic_distortion-form",
						label: "Probability",
						key: "elastic_distortion-prob-1",
						name: "elastic_distortion",
						required: true,
					},
					config: {
						setValue: findById(fields, "elastic_distortion-1")?.metadata
							?.probability?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "elastic_distortion-1",
								metadata: {
									probability: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
						options: {
							min: 0,
							max: 1,
							step: 0.1,
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "elastic_distortion-form",
						label: "Amount",
						key: "elastic_distortion-alpha-1",
						name: "elastic_distortion",
						required: true,
					},
					config: {
						setValue: (findById(fields, "elastic_distortion-1") as any)
							?.metadata?.config?.value?.amount?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "elastic_distortion-1",
								metadata: {
									config: {
										type: "Object",
										value: {
											alpha: {
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
				{
					template: "number",
					element: {
						testDataId: "elastic_distortion-form",
						label: "Salt Vs Pepper Ratio",
						key: "elastic_distortion-sigma-1",
						name: "elastic_distortion",
						required: true,
					},
					config: {
						setValue: (findById(fields, "elastic_distortion-1") as any)
							?.metadata?.config?.value?.salt_pepper_ratio?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "elastic_distortion-1",
								metadata: {
									config: {
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
				probability: z.number().positive(),
				config: z.object({
					alpha: z.number().positive(),
					sigma: z.number().positive(),
				}),
			}),
		},
		{
			type: "number",
			title: "Amount of Datasets",
			description: "Number of final datasets to be generated",
			icon: <IconTransform />,
			id: "number-1",
			metadata: {
				number: {
					type: "Number",
					value: 0,
				},
			},
			previewImg: [],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "number-form",
						label: "Amount",
						key: "number-1",
						name: "number",
						required: true,
					},
					config: {
						setValue: (findById(fields, "number-1") as any)?.metadata?.config
							?.value?.salt_pepper_ratio?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "number-1",
								metadata: {
									number: {
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
				number: z.number().positive(),
			}),
		},
	];
};
