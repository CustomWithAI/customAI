"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { elementContent } from "@/configs/elements/tools";
import { useClickAnyWhere } from "@/hooks/useClickAnyWhere";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useRouter } from "@/libs/i18nNavigation";
import { toCapital } from "@/utils/toCapital";
import {
	ArrowLeft,
	Copy,
	Home,
	Layers,
	MoreVertical,
	MoveDown,
	MoveUp,
	Plus,
	Trash2,
} from "lucide-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { ModeSelector } from "./mode-selector";

export interface CanvasElement {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	type: string;
	title?: string;
	color: string;
	inferenceId?: string;
	zIndex: number;
	children?: CanvasElement[];
	content?: ReactNode;
}

export default function CanvasWithOverlay() {
	const isMounted = useIsMounted();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const elementsContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { width: canvasWidth = 600, height: canvasHeight = 800 } =
		useWindowSize();

	const gridSize = 40;

	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);

	const [isDragging, setIsDragging] = useState(false);
	const dragStart = useRef<{ x: number; y: number } | null>(null);
	const firstScreen = useRef<boolean>(false);

	const [maxZIndex, setMaxZIndex] = useState(100);

	const [elements, setElements] = useLocalStorage<CanvasElement[]>(
		"canvas",
		[],
	);

	const [draggedElement, setDraggedElement] = useState<{
		id: string;
		parentId?: string;
	} | null>(null);

	const [newElementType, setNewElementType] = useState<string>("image");

	useClickAnyWhere(() => {
		firstScreen.current = true;
	});

	const handleChangeElement = useCallback(
		(id: string, value: Partial<CanvasElement>) => {
			setElements((prev) =>
				prev.map((element) =>
					element.id === id ? { ...element, ...value } : element,
				),
			);
		},
		[setElements],
	);

	const drawGrid = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		const startX =
			Math.floor(offsetX / gridSize) * gridSize - (offsetX % gridSize);
		const startY =
			Math.floor(offsetY / gridSize) * gridSize - (offsetY % gridSize);

		ctx.beginPath();
		ctx.strokeStyle = "#eee";
		ctx.lineWidth = 1;

		for (let x = startX; x <= canvasWidth + startX; x += gridSize) {
			const canvasX = x - offsetX;
			ctx.moveTo(canvasX, 0);
			ctx.lineTo(canvasX, canvasHeight);
		}

		for (let y = startY; y <= canvasHeight + startY; y += gridSize) {
			const canvasY = y - offsetY;
			ctx.moveTo(0, canvasY);
			ctx.lineTo(canvasWidth, canvasY);
		}

		ctx.stroke();
	}, [offsetX, offsetY, canvasHeight, canvasWidth]);

	const isPointOverElement = (x: number, y: number) => {
		return elements.some((el) => {
			const screenX = el.x - offsetX;
			const screenY = el.y - offsetY;
			return (
				x >= screenX &&
				x <= screenX + el.width &&
				y >= screenY &&
				y <= screenY + el.height
			);
		});
	};

	const isElementVisible = useCallback(
		(element: CanvasElement) => {
			const screenX = element.x - offsetX * 2;
			const screenY = element.y - offsetY * 2;

			return !(
				screenX > canvasWidth + 20 ||
				screenY > canvasHeight + 20 ||
				screenX + element.width < -20 ||
				screenY + element.height < -20
			);
		},
		[offsetX, offsetY, canvasWidth, canvasHeight],
	);

	const [isSpacePressed, setIsSpacePressed] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space" && !isSpacePressed) {
				setIsSpacePressed(true);
				if (containerRef.current) {
					containerRef.current.style.cursor = "grab";
				}
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === "Space") {
				setIsSpacePressed(false);
				if (containerRef.current) {
					containerRef.current.style.cursor = "";
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [isSpacePressed]);

	const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.button !== 0) return;

		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (!isPointOverElement(x, y) || isSpacePressed) {
			setIsDragging(true);
			dragStart.current = { x: e.clientX, y: e.clientY };

			if (isSpacePressed) {
				e.preventDefault();
				e.stopPropagation();
			}
		}
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.button === 1) {
			e.preventDefault();
			// setIsDragging(true);
			// dragStart.current = { x: e.clientX, y: e.clientY };
		}
	};

	const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging || !dragStart.current) return;

		const dx = e.clientX - dragStart.current.x;
		const dy = e.clientY - dragStart.current.y;

		dragStart.current = { x: e.clientX, y: e.clientY };

		setOffsetX((prev) => prev - dx / 2);
		setOffsetY((prev) => prev - dy / 2);
	};

	const handleContainerMouseUp = () => {
		setIsDragging(false);
		dragStart.current = null;
	};

	const handleContainerMouseLeave = () => {
		setIsDragging(false);
		dragStart.current = null;
	};

	const handleElementMouseDown = (
		e: React.MouseEvent,
		elementId: string,
		parentId?: string,
	) => {
		if (e.button !== 0) return;
		e.preventDefault();
		e.stopPropagation();

		bringToFront(elementId, parentId);

		setDraggedElement({ id: elementId, parentId });
		dragStart.current = { x: e.clientX, y: e.clientY };
	};

	const goToOrigin = () => {
		setOffsetX(0);
		setOffsetY(0);
	};

	const addNewElement = () => {
		const width = elementContent[newElementType]?.width ?? 300;
		const height = elementContent[newElementType]?.height ?? 200;

		const newZIndex = maxZIndex + 10;
		setMaxZIndex(newZIndex);

		const newElement: CanvasElement = {
			id: Date.now().toString(),
			x: offsetX * 2 + canvasWidth / 2 - width / 2,
			y: offsetY * 2 + canvasHeight / 2 - height / 2,
			width,
			height,
			type: newElementType,
			title: `${toCapital(newElementType)}`,
			color:
				newElementType === "group" ? "rgba(243, 244, 246, 0.8)" : "#f9fafb",
			zIndex: newZIndex,
			children: newElementType === "group" ? [] : undefined,
		};

		setElements((prev) => [...prev, newElement]);
	};

	const deleteElement = (id: string, parentId?: string) => {
		if (parentId) {
			setElements((prev) =>
				prev.map((el) => {
					if (el.id === parentId && el.children) {
						return {
							...el,
							children: el.children.filter((child) => child.id !== id),
						};
					}
					return el;
				}),
			);
		} else {
			setElements((prev) => prev.filter((el) => el.id !== id));
		}
	};

	const duplicateElement = (id: string, parentId?: string) => {
		if (parentId) {
			setElements((prev) =>
				prev.map((el) => {
					if (el.id === parentId && el.children) {
						const childToDuplicate = el.children.find(
							(child) => child.id === id,
						);
						if (!childToDuplicate) return el;

						const newChild: CanvasElement = {
							...childToDuplicate,
							id: `${parentId}-${Date.now()}`,
							x: childToDuplicate.x + 20,
							y: childToDuplicate.y + 20,
							zIndex: Math.max(...el.children.map((c) => c.zIndex)) + 1,
						};

						return {
							...el,
							children: [...el.children, newChild],
						};
					}
					return el;
				}),
			);
		} else {
			const elementToDuplicate = elements.find((el) => el.id === id);
			if (!elementToDuplicate) return;

			const newZIndex = maxZIndex + 10;
			setMaxZIndex(newZIndex);

			const newElement: CanvasElement = {
				...elementToDuplicate,
				id: Date.now().toString(),
				x: elementToDuplicate.x + 20,
				y: elementToDuplicate.y + 20,
				zIndex: newZIndex,
				children: elementToDuplicate.children
					? [...elementToDuplicate.children]
					: undefined,
			};

			setElements((prev) => [...prev, newElement]);
		}
	};

	const bringToFront = (id: string, parentId?: string) => {
		if (parentId) {
			setElements((prev) =>
				prev.map((el) => {
					if (el.id === parentId && el.children) {
						const maxChildZIndex = Math.max(
							...el.children.map((child) => child.zIndex),
						);
						return {
							...el,
							children: el.children.map((child) =>
								child.id === id
									? { ...child, zIndex: maxChildZIndex + 1 }
									: child,
							),
						};
					}
					return el;
				}),
			);
		} else {
			const newZIndex = maxZIndex + 10;
			setMaxZIndex(newZIndex);

			setElements((prev) =>
				prev.map((el) => (el.id === id ? { ...el, zIndex: newZIndex } : el)),
			);
		}
	};

	const sendToBack = (id: string, parentId?: string) => {
		if (parentId) {
			setElements((prev) =>
				prev.map((el) => {
					if (el.id === parentId && el.children) {
						const minChildZIndex = Math.min(
							...el.children.map((child) => child.zIndex),
						);
						return {
							...el,
							children: el.children.map((child) =>
								child.id === id
									? { ...child, zIndex: minChildZIndex - 1 }
									: child,
							),
						};
					}
					return el;
				}),
			);
		} else {
			setElements((prev) => {
				const minZIndex = Math.min(...prev.map((el) => el.zIndex));
				return prev.map((el) =>
					el.id === id ? { ...el, zIndex: minZIndex - 1 } : el,
				);
			});
		}
	};

	const moveForward = (id: string, parentId?: string) => {
		if (parentId) {
			setElements((prev) =>
				prev.map((el) => {
					if (el.id === parentId && el.children) {
						const sortedChildren = [...el.children].sort(
							(a, b) => a.zIndex - b.zIndex,
						);
						const currentIndex = sortedChildren.findIndex(
							(child) => child.id === id,
						);
						if (currentIndex === sortedChildren.length - 1) return el;

						const nextZIndex = sortedChildren[currentIndex + 1].zIndex;

						return {
							...el,
							children: el.children.map((child) =>
								child.id === id
									? { ...child, zIndex: nextZIndex + 0.1 }
									: child,
							),
						};
					}
					return el;
				}),
			);
		} else {
			setElements((prev) => {
				const sortedElements = [...prev].sort((a, b) => a.zIndex - b.zIndex);

				const currentIndex = sortedElements.findIndex((el) => el.id === id);
				if (currentIndex === sortedElements.length - 1) return prev;

				const nextZIndex = sortedElements[currentIndex + 1].zIndex;

				return prev.map((el) =>
					el.id === id ? { ...el, zIndex: nextZIndex + 0.1 } : el,
				);
			});
		}
	};

	const moveBackward = (id: string, parentId?: string) => {
		if (parentId) {
			setElements((prev) =>
				prev.map((el) => {
					if (el.id === parentId && el.children) {
						const sortedChildren = [...el.children].sort(
							(a, b) => a.zIndex - b.zIndex,
						);

						const currentIndex = sortedChildren.findIndex(
							(child) => child.id === id,
						);
						if (currentIndex === 0) return el;

						const prevZIndex = sortedChildren[currentIndex - 1].zIndex;

						return {
							...el,
							children: el.children.map((child) =>
								child.id === id
									? { ...child, zIndex: prevZIndex - 0.1 }
									: child,
							),
						};
					}
					return el;
				}),
			);
		} else {
			setElements((prev) => {
				const sortedElements = [...prev].sort((a, b) => a.zIndex - b.zIndex);

				const currentIndex = sortedElements.findIndex((el) => el.id === id);
				if (currentIndex === 0) return prev;

				const prevZIndex = sortedElements[currentIndex - 1].zIndex;

				return prev.map((el) =>
					el.id === id ? { ...el, zIndex: prevZIndex - 0.1 } : el,
				);
			});
		}
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!draggedElement || !dragStart.current) return;

			const dx = e.clientX - dragStart.current.x;
			const dy = e.clientY - dragStart.current.y;

			dragStart.current = { x: e.clientX, y: e.clientY };

			if (draggedElement.parentId) {
				setElements((prev) =>
					prev.map((el) => {
						if (el.id === draggedElement.parentId && el.children) {
							return {
								...el,
								children: el.children.map((child) =>
									child.id === draggedElement.id
										? { ...child, x: child.x + dx, y: child.y + dy }
										: child,
								),
							};
						}
						return el;
					}),
				);
			} else {
				setElements((prev) =>
					prev.map((el) =>
						el.id === draggedElement.id
							? { ...el, x: el.x + dx, y: el.y + dy }
							: el,
					),
				);
			}
		};

		const handleMouseUp = () => {
			setDraggedElement(null);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [draggedElement, setElements]);

	useEffect(() => {
		if (offsetX == null || offsetY == null) return;
		drawGrid();
	}, [offsetX, offsetY, drawGrid]);

	useEffect(() => {
		if (
			Math.abs(offsetX) > 100 ||
			(Math.abs(offsetY) > 100 && !firstScreen.current)
		) {
			firstScreen.current = true;
		}
	}, [offsetX, offsetY]);

	const renderElements = () => {
		return elements
			.sort((a, b) => a.zIndex - b.zIndex)
			.map((element) => {
				if (!isElementVisible(element)) {
					return null;
				}

				const screenX = element.x - offsetX * 2;
				const screenY = element.y - offsetY * 2;

				return (
					<div
						key={element.id}
						className="absolute rounded shadow-sm"
						style={{
							left: `${screenX}px`,
							top: `${screenY}px`,
							width: `${element.width}px`,
							height: `${element.height}px`,
							backgroundColor: element.color,
							zIndex: element.zIndex,
						}}
					>
						<div
							className="absolute top-0 left-0 right-0 h-6 bg-gray-100 border-b flex items-center px-2 cursor-grab z-10"
							onMouseDown={(e) => {
								handleElementMouseDown(e, element.id);
								handleMouseDown(e);
							}}
						>
							<div className="text-xs font-medium flex-1 truncate">
								{element.title} ({element.x}, {element.y})
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="h-5 w-5">
										<MoreVertical size={12} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="z-[400]" align="end">
									<DropdownMenuItem onClick={() => bringToFront(element.id)}>
										<Layers className="mr-2 h-4 w-4" />
										<span>Bring to Front</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => sendToBack(element.id)}>
										<Layers className="mr-2 h-4 w-4" />
										<span>Send to Back</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => moveForward(element.id)}>
										<MoveUp className="mr-2 h-4 w-4" />
										<span>Move Forward</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => moveBackward(element.id)}>
										<MoveDown className="mr-2 h-4 w-4" />
										<span>Move Backward</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => duplicateElement(element.id)}
									>
										<Copy className="mr-2 h-4 w-4" />
										<span>Duplicate</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => deleteElement(element.id)}
										className="text-red-600"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										<span>Delete</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className="pt-6 h-full overflow-auto">
							{elementContent[element.type]?.component(element, (v) =>
								handleChangeElement(element.id, v),
							)}
						</div>
					</div>
				);
			});
	};

	if (!isMounted || !canvasWidth || !canvasHeight) return null;
	return (
		<div
			key="canvas-wrapper"
			ref={containerRef}
			className="relative border border-gray-300 shadow-md cursor-move bg-white overflow-hidden"
			style={{ width: canvasWidth, height: canvasHeight }}
			onMouseDown={handleContainerMouseDown}
			onMouseMove={handleContainerMouseMove}
			onMouseUp={handleContainerMouseUp}
			onMouseLeave={handleContainerMouseLeave}
		>
			<canvas
				ref={canvasRef}
				width={canvasWidth}
				height={canvasHeight}
				className="block absolute top-0 left-0 pointer-events-none"
			/>
			<ModeSelector
				mode={isSpacePressed ? "hand" : "action"}
				onChange={(v) => {
					if (!containerRef.current) return;
					if (v === "hand") {
						containerRef.current.style.cursor = "grab";
					} else {
						containerRef.current.style.cursor = "";
					}
					setIsSpacePressed(v === "hand");
				}}
			/>
			<div
				ref={elementsContainerRef}
				className="absolute top-0 left-0 w-full h-full overflow-hidden"
			>
				{renderElements()}
			</div>
			<div className="absolute flex h-14 flex-col items-center z-[9999] shadow-sm justify-center top-4 left-4 px-2 rounded-lg bg-gray-100">
				<div className="flex flex-row items-center gap-2">
					<Button
						onClick={() => router.back()}
						effect="shineHover"
						className="flex items-center gap-2 h-10"
						variant="outline"
					>
						<ArrowLeft size={16} />
					</Button>
					<Button
						onClick={goToOrigin}
						effect="shineHover"
						className="flex items-center gap-2 h-10"
						variant="outline"
					>
						<Home size={16} />
					</Button>
					<Select
						value={newElementType}
						onValueChange={(value) => setNewElementType(value)}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select element type" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(elementContent).map(([key, _], index) => (
								<SelectItem key={`${key}${index}`} value={key}>
									{toCapital(key)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						onClick={addNewElement}
						className="flex items-center gap-2 h-10"
					>
						<Plus size={16} />
						Add
					</Button>
				</div>
			</div>
			{!firstScreen.current && (
				<div className="bottom-8 left-1/2 -translate-x-1/2 absolute mt-4 text-gray-300 text-center">
					<p>
						Drag the canvas to scroll | Drag the title bar to move components
					</p>
					<p className="mt-2">
						Use the dropdown menu to change element stacking order
					</p>
				</div>
			)}
		</div>
	);
}
