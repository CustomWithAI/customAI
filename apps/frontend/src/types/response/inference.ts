export type InferenceResponse = {
	id: string;
	trainingId: string;
	modelPath: string;
	modelConfig: Record<string, any>;
	imagePath: string;
	annotation:
		| {
				label: string;
		  }
		| {
				x: number;
				y: number;
				label: string;
				width: number;
				height: number;
				confidence?: number;
		  }[];
	status: string;
	queueId: string;
	retryCount: number;
	errorMessage: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
};
