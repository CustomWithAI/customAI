import type { ResponseDataset, ResponseImage } from "@/types/response/dataset";
import type { Editor, Label, Polygon, Square } from "@/types/square";
import { nanoid } from "nanoid";
import { generateRandomLabel } from "./random";

export const formatToEditor: (
	data: ResponseImage["annotation"] | undefined,
) => Partial<Editor> | undefined = (data) => {
	if (!data) {
		return undefined;
	}
	if (data.label) {
		return { classifiedLabel: data.label };
	}
	if (data.annotation) {
		const squares: Square[] = [];
		const polygons: Polygon[] = [];
		const { color } = generateRandomLabel();
		for (const shape of data.annotation) {
			if ("points" in shape) {
				polygons.push({
					id: nanoid(),
					color,
					isComplete: true,
					labelId: shape.label,
					points: shape.points,
				});
			} else {
				const { x, y, width, height, label } = shape;
				squares.push({
					x,
					y,
					width,
					labelId: label,
					height,
					isLocked: false,
					id: nanoid(),
				});
			}
		}
		return {
			squares,
			polygons,
		};
	}
};

export const formatToAnnotate = (data: Editor) => {
	if (!data.labels) return {};
	if (data.classifiedLabel) {
		return {
			label:
				data.labels.find((label) => label.id === data.classifiedLabel)?.name ||
				"",
		};
	}
	if (data.squares) {
		return {
			annotation: data.squares.map(({ x, y, width, height, labelId }) => ({
				x,
				y,
				width,
				height,
				label: data.labels.find((label) => label.id === labelId)?.name || "",
			})),
		};
	}
	if (data.polygons || data.freehandPaths) {
		return {
			annotation:
				data.polygons.map(({ points, labelId }) => ({
					points: points as { x: number; y: number }[],
					label: data.labels.find((label) => label.id === labelId)?.name || "",
				})) ||
				data.freehandPaths.map(({ points, labelId }) => ({
					points: points as { x: number; y: number }[],
					label: data.labels.find((label) => label.id === labelId)?.name || "",
				})),
		};
	}
};

export const formatToLabels: (
	labels: ResponseDataset["labels"],
) => Editor["labels"] | undefined = (labels) => {
	return labels?.map((label) => {
		const { color } = generateRandomLabel();
		return {
			id: nanoid(),
			color,
			name: label,
		} as Label;
	});
};
