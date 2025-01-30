import type { Square } from "@/types/square";
import { Lock, MoveDown, MoveUp, Unlock } from "lucide-react";
import { useEffect, useRef } from "react";

interface ContextMenuProps {
	x: number;
	y: number;
	square?: Square;
	onClose: () => void;
	onDelete: () => void;
	onUpdate: (square: Partial<Square>) => void;
	onMoveForward: () => void;
	onMoveBackward: () => void;
}

export function ContextMenu({
	x,
	y,
	square,
	onClose,
	onDelete,
	onUpdate,
	onMoveForward,
	onMoveBackward,
}: ContextMenuProps) {
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

	if (!square) return;
	return (
		<button
			type="button"
			ref={menuRef}
			className="absolute bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50"
			style={{ left: x, top: y }}
			onClick={handleClick}
		>
			<div className="px-1">
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
