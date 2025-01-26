"use client";

import { type DragEvent, useCallback, useMemo, useState } from "react";
import ReactFlow, {
	type Node,
	type Edge,
	addEdge,
	type Connection,
	useNodesState,
	useEdgesState,
	Background,
	Controls,
	type NodeTypes,
	type XYPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDragStore } from "@/contexts/dragContext";
import CustomNode from "@/features/blueprint/node";
import NodePalette from "@/features/blueprint/node-palette";
import VisualEdge from "@/features/blueprint/visual-edge";
import VisualBox from "@/features/blueprint/visual-node";
import { generateId } from "@/utils/generate-id";
import { useShallow } from "zustand/react/shallow";

const nodeTypes: NodeTypes = {
	custom: CustomNode,
};

export const VisualPreprocessingSection = () => {
	const fields = useDragStore(useShallow((state) => state.fields));
	const onDeleteNodeStore = useDragStore((state) => state.onDeleteNode);
	const onResetNodeStore = useDragStore((state) => state.onResetNode);
	const onAddNode = useDragStore((state) => state.onAddNode);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const initialNodes: Node[] = useMemo(() => {
		const processNode = fields.map((field, index) => ({
			id: field.id,
			type: "custom",
			position: (field.metadata.position?.value as unknown as XYPosition) || {
				x: 100 + index * 300,
				y: 100,
			},
			data: {
				title: field.title,
				description: field.description,
				image: "/placeholder.svg?height=200&width=200",
				value: "",
				type: "input",
				metadata: field.metadata,
				onChange: (value: string) => {
					updateNodeValue(field.id, value);
				},
				onDelete: () => {
					setNodes((nds) => nds.filter((node) => node.id !== field.id));
					onDeleteNodeStore(field.id);
				},
				onReset: () => onResetNodeStore(field.id),
			},
		}));
		const inputNode = {
			id: "input-1",
			type: "custom",
			position: { x: -200, y: 100 },
			data: {
				title: "Input Node",
				description: "This is the input node",
				image: "/placeholder.svg?height=200&width=200",
				value: "10",
				type: "input",
				onChange: () => {},
			},
		};
		const outputNode = {
			id: "output-1",
			type: "custom",
			position: { x: 200 + (fields.length + 1) * 300, y: 100 },
			data: {
				title: "Output Node",
				description: "This is the output node",
				image: "/placeholder.svg?height=200&width=200",
				value: "10",
				type: "output",
				onChange: () => {},
			},
		};
		return [inputNode, ...processNode, outputNode];
	}, [fields, onDeleteNodeStore, onResetNodeStore]);
	const initialEdges: Edge[] = useMemo(() => {
		const edges: Edge[] = [];

		for (let i = 0; i < fields.length; i++) {
			const sourceNode = fields[i];
			const targetNode = fields[i + 1];

			if (sourceNode && targetNode) {
				edges.push({
					id: `edge-${sourceNode.id}-${targetNode.id}`,
					source: sourceNode.id,
					target: targetNode.id,
					type: "default",
				});
			}
		}

		if (fields.length > 0) {
			edges.push({
				id: `edge-input-1-${fields[0].id}`,
				source: "input-1",
				target: fields[0].id,
				type: "default",
			});
		}

		if (fields.length > 0) {
			edges.push({
				id: `edge-${fields[fields.length - 1].id}-output-1`,
				source: fields[fields.length - 1].id,
				target: "output-1",
				type: "default",
			});
		}

		return edges;
	}, [fields]);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

	const onConnect = useCallback(
		(params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);

	const updateNodeValue = useCallback(
		(nodeId: string, value: string) => {
			setNodes((nds) =>
				nds.map((node) => {
					if (node.id === nodeId) {
						return {
							...node,
							data: {
								...node.data,
								value,
							},
						};
					}
					return node;
				}),
			);
		},
		[setNodes],
	);

	const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			if (!reactFlowInstance) return;

			const type = event.dataTransfer.getData("application/reactflow");
			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			}) as XYPosition;
			const id = generateId();
			const newNode = {
				id: id,
				type: "custom",
				position,
				data: {
					title: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
					description: `This is a ${type} node`,
					image: "/placeholder.svg?height=200&width=200",
					value: "",
					type: type,
					metadata: {
						position: { type: "Position" as const, value: position },
						value: { type: "String" as const, value: "" },
					},
					onChange: (value: string) => {
						onUpdateMetadata({
							id: id,
							metadata: { value: { type: "String", value } },
						});
					},
					onDelete: () => {
						setNodes((nds) => nds.filter((node) => node.id !== id));
						onDeleteNodeStore(id);
					},
					onReset: () => onResetNodeStore(id),
				},
			};

			setNodes((nds) => nds.concat(newNode));
			onAddNode({ ...newNode.data, id: newNode.id });
		},
		[
			reactFlowInstance,
			setNodes,
			onAddNode,
			onUpdateMetadata,
			onResetNodeStore,
			onDeleteNodeStore,
		],
	);

	const nodesWithHandlers = nodes.map((node) => ({
		...node,
		data: {
			...node.data,
			onChange: (value: string) => updateNodeValue(node.id, value),
		},
	}));

	return (
		<div id="main" className="flex w-full h-[95vh]">
			<div className="w-3/4 h-full">
				<ReactFlow
					nodes={nodesWithHandlers}
					edges={edges}
					onNodesChange={onNodesChange}
					className="border-y border-l rounded"
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					onNodeClick={(_, node) => setSelectedNode(node)}
					onEdgeClick={(_, edge) => setSelectedEdge(edge)}
					onInit={setReactFlowInstance}
					onDragOver={onDragOver}
					onDrop={onDrop}
					fitView
				>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
			<div className="w-1/4 h-full p-4 border-l">
				{selectedNode ? (
					<VisualBox
						node={selectedNode}
						onClose={() => setSelectedNode(null)}
					/>
				) : selectedEdge ? (
					<VisualEdge
						edge={selectedEdge}
						onRemoveEdge={() =>
							setEdges((eds) =>
								eds.filter((edge) => edge.id !== selectedEdge.id),
							)
						}
						onClose={() => setSelectedEdge(null)}
					/>
				) : (
					<NodePalette />
				)}
			</div>
		</div>
	);
};
