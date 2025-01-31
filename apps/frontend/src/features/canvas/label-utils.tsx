export const removeLabelFromShapes = <
	T extends { id: string; labelId?: string },
>(
	shapes: T[],
	labelId: string,
	updateFn: (id: string, data: { labelId?: string }) => void,
) => {
	for (const { id } of shapes.filter((shape) => shape.labelId === labelId)) {
		updateFn(id, { labelId: undefined });
	}
};

export const updateLabel = (
	shapeId: string | null,
	labelId: string,
	updateFn: (id: string, data: { labelId: string }) => void,
) => {
	if (shapeId) updateFn(shapeId, { labelId });
};
