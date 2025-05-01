import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import type { Label, Square } from "@/types/square";
import { Lock, MoveDown, MoveUp, Tag, Unlock } from "lucide-react";
import { useEffect, useRef } from "react";

interface ContextMenuProps {
	x: number;
	y: number;
	zoom: number;
	square?: Square;
	labels: Label[];
	onClose: () => void;
	onDelete: () => void;
	onUpdate: (square: Partial<Square>) => void;
	onMoveForward: () => void;
	onMoveBackward: () => void;
}

const X_OFFSET = 40;
const Y_OFFSET = 120;
export function ContextMenu({
	x,
	y,
	square,
	zoom,
	onClose,
	labels,
	onDelete,
	onUpdate,
	onMoveForward,
	onMoveBackward,
}: ContextMenuProps) {
	const menuRef = useRef<HTMLButtonElement>(null);

	useOnClickOutside(menuRef, () => onClose());

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	if (!square) return;
	return (
		<button
			type="button"
			ref={menuRef}
			className="absolute bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50"
			style={{ left: (x - X_OFFSET) / zoom, top: (y - Y_OFFSET) / zoom }}
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
								labelId: label.id === square.labelId ? undefined : label.id,
							})
						}
					>
						<Tag className="w-4 h-4" style={{ color: label.color }} />
						{label.name}
						{label.id === square.labelId && <span className="ml-auto">✓</span>}
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
					onClick={() => onUpdate({ isLocked: !square.isLocked })}
				>
					{square.isLocked ? (
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
					className="w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600 text-sm"
					onClick={onDelete}
				>
					Delete Square
				</button>
			</div>
		</button>
	);
}
