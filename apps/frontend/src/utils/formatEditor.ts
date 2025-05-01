import type { ResponseDataset, ResponseImage } from "@/types/response/dataset";
import type { Editor, Label, Polygon, Square } from "@/types/square";
import { nanoid } from "nanoid";
import { generateRandomLabel } from "./random";

export const formatToEditor: (
	data: ResponseImage["annotation"] | undefined,
	labels: ResponseDataset["labels"] | undefined,
) => Partial<Editor> | undefined = (data, labels) => {
	if (!data && !labels) {
		return undefined;
	}
	const generatedLabels = formatToLabels(labels);

	if (!data) {
		return {
			labels: generatedLabels,
		};
	}

	if (data?.label) {
		return {
			labels: generatedLabels,
			classifiedLabel: generatedLabels?.find((l) => l.name === data.label)?.id,
		};
	}
	if (data?.annotation) {
		const squares: Square[] = [];
		const polygons: Polygon[] = [];
		const { color } = generateRandomLabel();
		for (const shape of data.annotation) {
			if ("points" in shape) {
				polygons.push({
					id: nanoid(),
					color,
					isComplete: true,
					labelId: generatedLabels?.find((l) => l.name === shape.label)?.id,
					points: shape.points,
				});
			} else {
				const { x, y, width, height, label } = shape;
				squares.push({
					x,
					y,
					width,
					labelId: generatedLabels?.find((l) => l.name === label)?.id,
					height,
					isLocked: false,
					id: nanoid(),
				});
			}
		}
		return {
			labels: generatedLabels,
			squares,
			polygons,
		};
	}
};

export const formatToAnnotate = (data: Editor) => {
	if (!data.labels) return {};
	const labelMap = new Map(data.labels.map((l) => [l.id, l.name]));
	if (data.classifiedLabel) {
		return { label: labelMap.get(data.classifiedLabel) || "" };
	}
	if (data.squares && data.squares.length > 0) {
		return {
			annotation: data.squares
				.map(({ x, y, width, height, labelId }) => {
					const label = labelMap.get(labelId || "");
					return {
						x,
						y,
						width,
						height,
						label: label || "",
					};
				})
				.filter((f) => f !== undefined),
		};
	}
	if (data.polygons || data.freehandPaths) {
		return {
			annotation: [
				...(data.polygons
					.map(({ points, labelId }) => {
						const label = labelMap.get(labelId || "");
						return { points, label: label || "" };
					})
					?.filter((f) => f !== undefined) || []),
				...(data.freehandPaths
					.map(({ points, labelId }) => {
						const label = labelMap.get(labelId || "");
						return {
							points: points as { x: number; y: number }[],
							label: label || "",
						};
					})
					?.filter((f) => f !== undefined) || []),
			],
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
			color: label.color || color,
			name: label.name,
		} as Label;
	});
};
