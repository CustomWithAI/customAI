export interface SquareStyle {
	backgroundColor?: string;
	borderColor?: string;
	borderWidth?: number;
	borderRadius?: number;
	opacity?: number;
	rotation?: number; // in degrees
	shadow?: {
		blur?: number;
		color?: string;
		offset?: { x: number; y: number };
	};
	hover?: {
		backgroundColor?: string;
		borderColor?: string;
		scale?: number;
	};
}

export interface Square {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	style?: SquareStyle;
	rotation: number;
}

export interface SquareChange {
	square: Square;
	type: "create" | "update" | "delete";
}

export interface Position {
	x: number;
	y: number;
}

export const squarePresets = {
	default: {
		backgroundColor: "#ffffff",
		borderColor: "#000000",
		borderWidth: 2,
		borderRadius: 0,
		opacity: 1,
		rotation: 0,
	},
	rounded: {
		backgroundColor: "#ffffff",
		borderColor: "#000000",
		borderWidth: 2,
		borderRadius: 8,
		opacity: 1,
		rotation: 0,
	},
	shadowed: {
		backgroundColor: "#ffffff",
		borderColor: "#000000",
		borderWidth: 2,
		borderRadius: 4,
		opacity: 1,
		rotation: 0,
		shadow: {
			blur: 10,
			color: "rgba(0, 0, 0, 0.2)",
			offset: { x: 2, y: 2 },
		},
	},
	glass: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderColor: "rgba(255, 255, 255, 0.2)",
		borderWidth: 1,
		borderRadius: 8,
		opacity: 0.8,
		rotation: 0,
		shadow: {
			blur: 5,
			color: "rgba(255, 255, 255, 0.1)",
			offset: { x: 0, y: 0 },
		},
	},
} as const;
