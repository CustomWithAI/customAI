import { client } from "./connection";

export const uploadFile = async (
	filePath: string,
	fileContent: string | ArrayBuffer | Buffer,
	contentType: string,
): Promise<void> => {
	const file = client.file(filePath);
	await file.write(fileContent, { type: contentType });
};

export const readJsonFile = async <T extends object>(
	filePath: string,
): Promise<T> => {
	const file = client.file(filePath);
	return await file.json();
};

export const downloadFile = async (key: string): Promise<string | null> => {
	try {
		const s3file = client.file(key);
		return await s3file.text();
	} catch (error) {
		console.error(`Failed to download file ${key}:`, error);
		return null;
	}
};

export const deleteFile = async (filePath: string): Promise<void> => {
	const file = client.file(filePath);
	await file.delete();
};

export const generatePresignedUrl = (
	filePath: string,
	expiresIn = 3600,
): string => {
	const file = client.file(filePath);
	return file.presign({
		acl: "public-read",
		expiresIn,
	});
};
