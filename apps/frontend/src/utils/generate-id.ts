export const generateId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const generateEdgeId = (source?: string, target?: string) => {
	if (!source || !target) {
		console.warn("Missing source or target for edge:", { source, target });
		return `edge-fallback-${crypto.randomUUID()}`;
	}
	return `edge-${source}-${target}`;
};
