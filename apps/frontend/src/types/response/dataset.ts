export type ResponseDataset = {
	name: string;
	description: string;
	annotationMethod: string;
	splitData: string;
	id: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	images: string[];
	imageCount: number;
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
