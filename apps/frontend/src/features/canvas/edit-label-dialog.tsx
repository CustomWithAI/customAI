"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Label as LabelType } from "@/types/square";
import { useState } from "react";
import { ColorPicker } from "./color-picker";

interface EditLabelDialogProps {
	label: LabelType;
	open: boolean;
	onClose: () => void;
	onSave: (label: LabelType) => void;
}

export function EditLabelDialog({
	label,
	open,
	onClose,
	onSave,
}: EditLabelDialogProps) {
	const [name, setName] = useState(label.name);
	const [color, setColor] = useState(label.color);

	const handleSave = () => {
		onSave({
			...label,
			name,
			color,
		});
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle>Edit Label</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4 ">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="space-y-4 flex align-middle">
						<Label className="mt-5">Color</Label>
						<ColorPicker value={color} onChange={setColor} />
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
