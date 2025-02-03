import type { Metadata } from "@/stores/dragStore";
import { useEdges, useNodes } from "reactflow";

type NodeData = {
	id: string;
	type: string;
	value: string;
};

export default function usePreviousNodesData(id: string): NodeData[] {
	const nodes = useNodes<{ type: string; value: string }>();
	const edges = useEdges();

	const rootNode = nodes.find((node) => {
		const incomingEdges = edges.filter((edge) => edge.target === node.id);
		return incomingEdges.length === 0;
	});

	const traverseGraph = (
		nodeId: string,
		visited = new Set<string>(),
	): NodeData[] => {
		if (visited.has(nodeId)) return [];
		visited.add(nodeId);

		const currentNode = nodes.find((node) => node.id === nodeId);
		if (!currentNode) return [];

		const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
		const childNodesData = outgoingEdges.flatMap((edge) =>
			traverseGraph(edge.target, visited),
		);

		return [
			{
				id: currentNode.id,
				type: currentNode.data.type,
				value: currentNode.data.value,
			},
			...childNodesData,
		];
	};

	const previousNodesData = rootNode ? traverseGraph(rootNode.id) : [];

	return previousNodesData;
}
