"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import Image from "next/image";
import type { CustomNodeData } from "./node";

interface VisualBoxProps {
	onClose: () => void;
	node: {
		data: CustomNodeData;
	} | null;
}

export default function VisualBox({ node, onClose }: VisualBoxProps) {
	if (!node) {
		return null;
	}

	const { title, description, image, value, type } = node.data;

	return (
		<Card className="h-full">
			<CardHeader className="relative">
				<CardTitle>Node Details</CardTitle>
				<button
					type="button"
					className="absolute top-4 right-4 p-1 hover:bg-zinc-100"
					onClick={onClose}
				>
					<X className="w-5 h-5" />
				</button>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="relative w-full h-48">
					<Image
						src={image || "/placeholder.svg"}
						alt={title}
						fill
						className="object-cover rounded-md"
					/>
				</div>
				<div className="space-y-2">
					<div>
						<Label>Type</Label>
						<Input
							value={type.charAt(0).toUpperCase() + type.slice(1)}
							readOnly
						/>
					</div>
					<div>
						<Label>Title</Label>
						<Input value={title} readOnly />
					</div>
					<div>
						<Label>Description</Label>
						<Textarea value={description} readOnly />
					</div>
					<div>
						<Label>Current Value</Label>
						<Input value={value} readOnly />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
