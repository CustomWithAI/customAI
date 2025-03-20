export type ResponseDataset = {
	name: string;
	description: string;
	annotationMethod?: string;
	train?: number;
	test?: number;
	valid?: number;
	labels?: string[];
	id: string;
	split_method: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	images: string[];
	imageCount: number;
};

export type ResponseSurroundImage = {
	prev: ResponseImage;
	current: ResponseImage;
	next: ResponseImage;
};
export type ResponseImage = {
	path: string;
	url: string;
	annotation: {
		label?: string;
		annotation?:
			| { x: number; y: number; width: number; height: number; label: string }[]
			| { points: { x: number; y: number }[]; label: string }[]
			| undefined;
	};
	createdAt: string;
	updatedAt: string;
	datasetId: string;
};
