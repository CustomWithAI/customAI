export type ResponseUploadFile = {
	id: string;
	file_name: string;
	purpose: string;
	url: string;
	external_reference_id: string[];
	provider: string;
	metadata: any;
	created_at: string;
	updated_at: string;
};
