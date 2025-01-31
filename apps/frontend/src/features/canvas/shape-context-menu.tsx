import type { FreehandPath, Label, Polygon } from "@/types/square";
import { Lock, MoveDown, MoveUp, Tag, Trash2, Unlock } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";

interface ShapeContextMenuProps {
	x: number;
	y: number;
	shape: Polygon | FreehandPath | undefined;
	labels: Label[];
	onClose: () => void;
	onDelete: () => void;
	onUpdate: (updates: Partial<Polygon | FreehandPath>) => void;
	onMoveForward: () => void;
	onMoveBackward: () => void;
}
const X_OFFSET = 40;
const Y_OFFSET = 120;

export function ShapeContextMenu({
	x,
	y,
	shape,
	labels,
	onClose,
	onDelete,
	onUpdate,
	onMoveForward,
	onMoveBackward,
}: ShapeContextMenuProps) {
	const menuRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};
	if (!shape) {
		console.log("unable to find shape");
		return;
	}
	return (
		<button
			type="button"
			ref={menuRef}
			className="absolute bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50"
			style={{ left: x - X_OFFSET, top: y - Y_OFFSET }}
			onClick={handleClick}
		>
			<div className="px-1">
				<div className="px-3 py-2 text-sm text-gray-500">Labels</div>
				{labels.map((label) => (
					<button
						key={label.id}
						className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2"
						onClick={() =>
							onUpdate({
								labelId: label.id === shape.labelId ? undefined : label.id,
							})
						}
					>
						<Tag className="w-4 h-4" style={{ color: label.color }} />
						{label.name}
						{label.id === shape.labelId && <span className="ml-auto">✓</span>}
					</button>
				))}
				<div className="h-px bg-gray-200 my-2" />
				<button
					className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2"
					onClick={() => onMoveForward()}
				>
					<MoveUp className="w-4 h-4" />
					Bring Forward
				</button>
				<button
					className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2"
					onClick={() => onMoveBackward()}
				>
					<MoveDown className="w-4 h-4" />
					Send Backward
				</button>
				<button
					className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2"
					onClick={() => onUpdate({ isLocked: !shape.isLocked })}
				>
					{shape.isLocked ? (
						<>
							<Unlock className="w-4 h-4" />
							Unlock
						</>
					) : (
						<>
							<Lock className="w-4 h-4" />
							Lock
						</>
					)}
				</button>
				<button
					className="w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600 text-sm flex items-center gap-2"
					onClick={onDelete}
				>
					<Trash2 className="w-4 h-4" />
					Delete Shape
				</button>
			</div>
		</button>
	);
}
