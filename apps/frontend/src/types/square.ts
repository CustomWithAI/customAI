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

export interface Label {
	id: string;
	name: string;
	color: string;
}
