"use client";

import { type DragEvent, useCallback, useMemo, useRef, useState } from "react";
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
import {
	DialogBuilder,
	type DialogBuilderRef,
} from "@/components/builder/dialog";
import { useDragStore } from "@/contexts/dragContext";
import NodePalette from "@/features/blueprint/node-palette";
import VisualEdge from "@/features/blueprint/visual-edge";
import VisualBox from "@/features/blueprint/visual-node";
import { useSizeScreen } from "@/hooks/useSizeScreen";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import type { CustomNodeData } from "@/types/node";
import { generateId } from "@/utils/generate-id";
import { SwatchBook } from "lucide-react";
import type { ZodRawShape } from "zod";
import { useShallow } from "zustand/react/shallow";

type VisualProps = {
	node: (
		fields: DragColumn<ZodRawShape>[],
		onUpdateMetadata: (payload: {
			id: string;
			metadata: Metadata;
		}) => void,
	) => DragColumn[];
	image: string;
	customNode: ({
		data,
		id,
	}: {
		data: CustomNodeData;
		id: string;
	}) => JSX.Element;
};
export const VisualSection = ({ node, customNode, image }: VisualProps) => {
	const dialogRef = useRef<DialogBuilderRef>(null);
	const { isLessThan } = useSizeScreen();
	const fields = useDragStore(useShallow((state) => state.fields));
	const onDeleteNodeStore = useDragStore((state) => state.onDeleteNode);
	const onResetNodeStore = useDragStore((state) => state.onResetNode);
	const onAddNode = useDragStore((state) => state.onAddNode);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);

	const nodeTypes: NodeTypes = useMemo(
		() => ({
			custom: customNode,
		}),
		[customNode],
	);

	const initialNodes: Node[] = useMemo(() => {
		const processNode = fields.map((field, index) => ({
			id: field.id,
			type: "custom",
			position: (field.metadata.position?.value as unknown as XYPosition) || {
				x: 100 + index * 320,
				y: 100,
			},
			data: {
				id: field.id,
				title: field.title,
				description: field.description,
				image: image,
				value: "",
				type: "custom",
				metadata: field.metadata,
				previewImg: field.previewImg,
				inputSchema: field.inputSchema,
				inputField: field.inputField,
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
				id: "input-1",
				title: "Input Node",
				description: "This is the input node",
				image: image,
				type: "input",
				onChange: () => {},
			},
		};
		const outputNode = {
			id: "output-1",
			type: "custom",
			position: { x: 150 + fields.length * 320, y: 100 },
			data: {
				id: "output-1",
				title: "Output Node",
				description: "This is the output node",
				image: image,
				type: "output",
				onChange: () => {},
			},
		};
		return [inputNode, ...processNode, outputNode];
	}, [fields, onDeleteNodeStore, image, onResetNodeStore]);

	const initialEdges: Edge[] = useMemo(() => {
		const edges: Edge[] = [];

		for (let i = 0; i < fields.length; i++) {
			const sourceNode = fields[i];
			const targetNode = fields[i + 1];

			if (sourceNode && targetNode) {
				edges.push({
					id: `edge-${sourceNode.id}-${targetNode.id}`,
					source: sourceNode.id ?? `fallback-source-${i}`,
					target: targetNode.id ?? `fallback-target-${i + 1}`,
					type: "default",
				});
			}
		}

		if (fields.length > 0) {
			edges.push({
				id: `edge-input-1-${fields[0].id}`,
				source: "input-1",
				target: fields[0]?.id ?? "fallback-target-0",
				type: "default",
			});
		}
		if (fields.length > 0) {
			edges.push({
				id: `edge-${fields[fields.length - 1].id}-output-1`,
				source:
					fields[fields.length - 1]?.id ??
					`fallback-source-${fields.length - 1}`,
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

	const mainNode = useMemo(() => {
		return node(fields, onUpdateMetadata);
	}, [fields, onUpdateMetadata, node]);

	const onDrop = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			if (!reactFlowInstance) return;

			const type = event.dataTransfer.getData("application/reactflow");
			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			}) as XYPosition;
			const node = mainNode.find((node) => node.type === type);
			const id = node?.id || generateId();
			const newNode = {
				id: id,
				type: "custom",
				position,
				data: {
					id: id,
					title: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
					description: `This is a ${type} node`,
					image: image,
					value: "",
					previewImg: node?.previewImg,
					type: type,
					metadata: {
						position: { type: "Position" as const, value: position },
						...(node?.metadata || { value: { type: "String", value: "" } }),
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
			mainNode,
			reactFlowInstance,
			setNodes,
			onAddNode,
			onUpdateMetadata,
			image,
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
		<div id="main" className="relative flex w-full h-[95vh]">
			<div className="w-full lg:w-3/4 h-full">
				<ReactFlow
					nodes={nodesWithHandlers}
					edges={edges}
					onNodesChange={(e) => {
						e.map((nodeEvent) => {
							nodeEvent.type === "position"
								? onUpdateMetadata({
										id: nodeEvent.id,
										metadata: {
											position: {
												type: "Position",
												value: nodeEvent.position as XYPosition,
											},
										},
									})
								: undefined;
						});
						onNodesChange(e);
					}}
					className="border-y border-l rounded-sm"
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					onNodeClick={(_, node) => {
						setSelectedNode(node);
						setSelectedEdge(null);
					}}
					onEdgeClick={(_, edge) => {
						setSelectedNode(null);
						setSelectedEdge(edge);
					}}
					onInit={setReactFlowInstance}
					onDragOver={onDragOver}
					onDrop={onDrop}
					fitView
				>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
			<div className="lg:w-1/4 h-full lg:border-l border-collapse">
				{isLessThan("xl") ? (
					<DialogBuilder
						ref={dialogRef}
						config={{
							trigger: (
								<button
									className="absolute top-3 right-3 rounded-lg border hover:bg-zinc-50"
									type="button"
								>
									<SwatchBook className="w-5 h-5 m-2" />
								</button>
							),
							title: "Node Palette",
							body: (
								<NodePalette
									node={node}
									noTitle
									onPickUp={() => {
										dialogRef.current?.close();
									}}
								/>
							),
						}}
					/>
				) : selectedNode ? (
					<VisualBox
						node={node}
						selectedNode={selectedNode}
						onClose={() => setSelectedNode(null)}
					/>
				) : selectedEdge ? (
					<VisualEdge
						edge={selectedEdge as Edge}
						onRemoveEdge={() =>
							setEdges((eds) =>
								eds.filter((edge) => edge.id !== (selectedEdge as Edge).id),
							)
						}
						onClose={() => setSelectedEdge(null)}
					/>
				) : (
					<NodePalette node={node} />
				)}
			</div>
		</div>
	);
};
