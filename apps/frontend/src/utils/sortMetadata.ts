import type { DragColumn, Metadata } from "@/stores/dragStore";

export const sortedMetadata = (
	data: DragColumn[],
	order: string[],
): DragColumn[] => {
	return data.sort((a, b) => {
		const indexA = order.indexOf(a.type || "");
		const indexB = order.indexOf(b.type || "");

		if (indexA === -1 && indexB === -1) return 0;
		if (indexA === -1) return 1;
		if (indexB === -1) return -1;

		return indexA - indexB;
	});
};
