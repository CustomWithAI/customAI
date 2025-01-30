"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateId } from "@/utils/generate-id";
import { Trash2, X } from "lucide-react";
import type { Edge } from "reactflow";

interface VisualEdgeProps {
	edge: Edge;
	onRemoveEdge: () => void;
	onClose: () => void;
}

export default function VisualEdge({
	edge,
	onRemoveEdge,
	onClose,
}: VisualEdgeProps) {
	const id = generateId();
	return (
		<Card className="mt-4">
			<CardHeader className="relative">
				<CardTitle>Edge Details</CardTitle>
				<button
					type="button"
					className="absolute top-4 right-4 p-1 hover:bg-zinc-100"
					onClick={onClose}
				>
					<X className="w-5 h-5" />
				</button>
			</CardHeader>

			<CardContent className="space-y-2">
				<div
					key={edge?.id || id}
					className="flex items-center justify-between p-2 border rounded-md"
				>
					<div>
						<p className="text-sm">
							<strong>Source:</strong> {edge?.source}
						</p>
						<p className="text-sm">
							<strong>Target:</strong> {edge?.target}
						</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							onRemoveEdge();
							onClose();
						}}
						className="text-red-600 hover:bg-red-50"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
