import type { Filter } from "@/components/ui/enhanceImage";
import type { Metadata } from "@/stores/dragStore";
import { useEdges, useNodes } from "reactflow";

type NodeData = {
	id: string;
	type: string;
	metadata: Metadata;
	previewImg: Filter[];
};

export default function usePreviousNodesData(id: string): NodeData[] {
	const nodes = useNodes<{
		type: string;
		value: string;
		metadata: Metadata;
		previewImg: Filter[];
	}>();
	const edges = useEdges();

	const nodeMap = new Map(nodes.map((node) => [node.id, node]));

	const incomingEdgesMap = new Map<string, string[]>();
	for (const { source, target } of edges) {
		if (!incomingEdgesMap.has(target)) {
			incomingEdgesMap.set(target, []);
		}
		incomingEdgesMap.get(target)?.push(source);
	}

	const previousNodes: NodeData[] = [];
	const queue: string[] = incomingEdgesMap.get(id) || [];
	const visited = new Set<string>();

	while (queue.length) {
		const nodeId = queue.shift();
		if (!nodeId) {
			console.warn("no node to visit");
			break;
		}
		if (visited.has(nodeId)) continue;
		visited.add(nodeId);

		const node = nodeMap.get(nodeId);
		if (node) {
			previousNodes.push({
				id: node.id,
				type: node.data.type,
				metadata: node.data.metadata,
				previewImg: node.data.previewImg,
			});
		}

		queue.push(...(incomingEdgesMap.get(nodeId) || []));
	}

	return previousNodes;
}
