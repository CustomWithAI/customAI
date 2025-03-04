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
import { Crop, Droplet, Scaling } from "lucide-react";
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
	];
};
