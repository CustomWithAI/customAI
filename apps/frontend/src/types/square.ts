export interface Square {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	labelId?: string;
	zIndex?: number;
	isLocked?: boolean;
}

export interface Position {
	x: number;
	y: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface Label {
	id: string;
	name: string;
	color: string;
}

export interface Transform {
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
}

export interface Polygon {
	id: string;
	points: Point[];
	color: string;
	isComplete: boolean;
	labelId?: string;
	zIndex?: number;
	isLocked?: boolean;
}

export interface FreehandPath {
	id: string;
	points: Point[];
	color: string;
	labelId?: string;
	zIndex?: number;
	isLocked?: boolean;
}

export interface Editor {
	id: string;
	squares: Square[];
	labels: Label[];
	classifiedLabel?: string;
	mode: Mode;
	polygons: Polygon[];
	freehandPaths: FreehandPath[];
}

export type Mode = "square" | "polygon" | "freehand" | "select" | "delete";

export type ShapeType = Square | Polygon | FreehandPath;

export type SelectedShape = {
	type: "polygon" | "path";
	id: string;
} | null;
