export type InferenceResponse = {
	id: string;
	trainingId: string;
	modelPath: string;
	modelConfig: Record<string, any>;
	imagePath: string;
	annotation: (Square | SquareWithConfident | Polygon | ClassifiedLabel)[];
	status: string;
	queueId: string;
	retryCount: number;
	errorMessage: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
};

export type ClassifiedLabel = {
	label: string;
};

export type Square = {
	x: number;
	y: number;
	label: string;
	width: number;
	height: number;
};

export type SquareWithConfident = Square & {
	confidence: number;
};

export type Polygon = {
	points: {
		x: number;
		y: number;
	}[];
	label: string;
};
