import { type SquareStyle, squarePresets } from "@/types/square";
import { useEffect, useRef, useState } from "react";

interface ContextMenuProps {
	x: number;
	y: number;
	onDelete: () => void;
	onUpdateStyle: (style: Partial<SquareStyle>) => void;
	onClose: () => void;
}

export function ContextMenu({
	x,
	y,
	onDelete,
	onUpdateStyle,
	onClose,
}: ContextMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);
	const [showStyleMenu, setShowStyleMenu] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	return (
		<div
			ref={menuRef}
			className="absolute bg-white border border-gray-200 rounded shadow-lg py-1 z-50"
			style={{ left: x, top: y }}
		>
			<div className="relative">
				<button
					className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm flex items-center justify-between"
					onClick={() => setShowStyleMenu(!showStyleMenu)}
				>
					<span>Style</span>
					<span className="ml-1.5">→</span>
				</button>
				{showStyleMenu && (
					<div className="absolute w-48 left-full top-0 bg-white border border-gray-200 rounded shadow-lg py-1 ml-1">
						{Object.entries(squarePresets).map(([name, style]) => (
							<button
								key={name}
								className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
								onClick={() => onUpdateStyle(style)}
							>
								{name.charAt(0).toUpperCase() + name.slice(1)}
							</button>
						))}
					</div>
				)}
			</div>
			<button
				className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
				onClick={onDelete}
			>
				Delete
			</button>
		</div>
	);
}
