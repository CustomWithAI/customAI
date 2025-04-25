export function getPolygonArea(points: { x: number; y: number }[]): number {
	let area = 0;
	const n = points.length;

	for (let i = 0; i < n; i++) {
		const { x: x1, y: y1 } = points[i];
		const { x: x2, y: y2 } = points[(i + 1) % n];
		area += x1 * y2 - x2 * y1;
	}

	return Math.abs(area / 2);
}
