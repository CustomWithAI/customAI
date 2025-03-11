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
			type: "orb",
			title: "Oriented FAST and Rotated BRIEF",
			description: "Convert image to grayscale",
			icon: <Droplet />,
			id: "orb-1",
			metadata: {
				n_keypoints: {
					type: "Number",
					value: 0,
				},
				scale_factor: {
					type: "Number",
					value: 1,
				},
				n_level: {
					type: "Number",
					value: 1,
				},
			},
			previewImg: [
				{
					type: "orb",
					params: [
						Number(findById(fields, "orb-1")?.metadata?.n_keypoints?.value) ||
							100,
						Number(findById(fields, "orb-1")?.metadata?.scale_factor?.value) ||
							1,
						Number(findById(fields, "orb-1")?.metadata?.n_level?.value) || 1,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "orb-form",
						label: "N Keypoints",
						key: "orb-n-1",
						name: "orb",
					},
					config: {
						setValue: findById(fields, "orb-1")?.metadata?.n_keypoints?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "orb-1",
								metadata: {
									n_keypoints: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "orb-form",
						label: "Scale Factor",
						key: "orb-scale-1",
						name: "orb",
					},
					config: {
						setValue: findById(fields, "orb-1")?.metadata?.scale_factor?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "orb-1",
								metadata: {
									scale_factor: {
										type: "Number",
										value: value as number,
									},
								},
							});
						},
					},
				},
				{
					template: "number",
					element: {
						testDataId: "orb-form",
						label: "N Level",
						key: "orb-1",
						name: "orb",
					},
					config: {
						setValue: findById(fields, "orb-1")?.metadata?.n_level
							?.value as boolean,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "orb-1",
								metadata: {
									n_level: {
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
			}),
		},
	];
};
