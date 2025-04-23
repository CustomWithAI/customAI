import type { DragColumn, Metadata } from "@/stores/dragStore";
import { findById } from "@/utils/findId";
import { Crop, Droplet, Grid, Scaling, Search } from "lucide-react";
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
		{
			type: "hog",
			title: "Histogram of Oriented Gradients",
			description: "Feature extraction for object detection",
			icon: <Grid />,
			id: "hog-1",
			metadata: {
				pixels_per_cell_x: {
					type: "Number",
					value: 8,
				},
				pixels_per_cell_y: {
					type: "Number",
					value: 8,
				},
				cells_per_block_x: {
					type: "Number",
					value: 2,
				},
				cells_per_block_y: {
					type: "Number",
					value: 2,
				},
				orientations: {
					type: "Number",
					value: 9,
				},
			},
			previewImg: [
				{
					type: "hog",
					params: [
						[
							Number(
								findById(fields, "hog-1")?.metadata?.pixels_per_cell_x?.value,
							) || 8,
							Number(
								findById(fields, "hog-1")?.metadata?.pixels_per_cell_y?.value,
							) || 8,
						],
						[
							Number(
								findById(fields, "hog-1")?.metadata?.cells_per_block_x?.value,
							) || 2,
							Number(
								findById(fields, "hog-1")?.metadata?.cells_per_block_y?.value,
							) || 2,
						],
						Number(findById(fields, "hog-1")?.metadata?.orientations?.value) ||
							9,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "hog-form",
						label: "Pixels Per Cell X",
						key: "hog-pixels-x-1",
						name: "hog",
					},
					config: {
						setValue: findById(fields, "hog-1")?.metadata?.pixels_per_cell_x
							?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "hog-1",
								metadata: {
									pixels_per_cell_x: {
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
						testDataId: "hog-form",
						label: "Pixels Per Cell Y",
						key: "hog-pixels-y-1",
						name: "hog",
					},
					config: {
						setValue: findById(fields, "hog-1")?.metadata?.pixels_per_cell_y
							?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "hog-1",
								metadata: {
									pixels_per_cell_y: {
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
						testDataId: "hog-form",
						label: "Cells Per Block X",
						key: "hog-cells-x-1",
						name: "hog",
					},
					config: {
						setValue: findById(fields, "hog-1")?.metadata?.cells_per_block_x
							?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "hog-1",
								metadata: {
									cells_per_block_x: {
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
						testDataId: "hog-form",
						label: "Cells Per Block Y",
						key: "hog-cells-y-1",
						name: "hog",
					},
					config: {
						setValue: findById(fields, "hog-1")?.metadata?.cells_per_block_y
							?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "hog-1",
								metadata: {
									cells_per_block_y: {
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
						testDataId: "hog-form",
						label: "Orientations",
						key: "hog-orientations-1",
						name: "hog",
					},
					config: {
						setValue: findById(fields, "hog-1")?.metadata?.orientations?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "hog-1",
								metadata: {
									orientations: {
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
		{
			type: "sift",
			title: "Scale-Invariant Feature Transform",
			description: "Feature detection for image matching",
			icon: <Search />,
			id: "sift-1",
			metadata: {
				n_keypoints: {
					type: "Number",
					value: 128,
				},
				contrast_threshold: {
					type: "Number",
					value: 0.04,
				},
				edge_threshold: {
					type: "Number",
					value: 10,
				},
			},
			previewImg: [
				{
					type: "sift",
					params: [
						Number(findById(fields, "sift-1")?.metadata?.n_keypoints?.value) ||
							128,
						Number(
							findById(fields, "sift-1")?.metadata?.contrast_threshold?.value,
						) || 0.04,
						Number(
							findById(fields, "sift-1")?.metadata?.edge_threshold?.value,
						) || 10,
					],
				},
			],
			inputField: [
				{
					template: "number",
					element: {
						testDataId: "sift-form",
						label: "N Keypoints",
						key: "sift-n-1",
						name: "sift",
					},
					config: {
						setValue: findById(fields, "sift-1")?.metadata?.n_keypoints?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "sift-1",
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
						testDataId: "sift-form",
						label: "Contrast Threshold",
						key: "sift-contrast-1",
						name: "sift",
					},
					config: {
						setValue: findById(fields, "sift-1")?.metadata?.contrast_threshold
							?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "sift-1",
								metadata: {
									contrast_threshold: {
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
						testDataId: "sift-form",
						label: "Edge Threshold",
						key: "sift-edge-1",
						name: "sift",
					},
					config: {
						setValue: findById(fields, "sift-1")?.metadata?.edge_threshold
							?.value,
						setOnChange: (value: unknown) => {
							onUpdateMetadata({
								id: "sift-1",
								metadata: {
									edge_threshold: {
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
