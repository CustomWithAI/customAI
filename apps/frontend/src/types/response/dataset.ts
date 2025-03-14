export type ResponseDataset = {
	name: string;
	description: string;
	annotationMethod: string;
	train: number;
	test: number;
	valid: number;
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
	class: string | null;
	annotation: string;
	createdAt: string;
	updatedAt: string;
	datasetId: string;
};
