import type { FileMetadata } from "@/hooks/use-file-upload";

export function getImageSize(
	url: string,
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = url;
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.onerror = reject;
	});
}

export async function getImageFileSize(url: string): Promise<number | null> {
	try {
		const response = await fetch(url, { method: "HEAD" });
		const contentLength = response.headers.get("Content-Length");
		return contentLength ? Number.parseInt(contentLength, 10) : null;
	} catch (error) {
		console.error("Error fetching image size:", error);
		return null;
	}
}

export function getImageSizeFromBlob(
	blob: Blob,
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.onerror = reject;
		img.src = URL.createObjectURL(blob);
	});
}

export function getImageFileSizeFromBlob(blob: Blob): number {
	return blob.size;
}

export function getImageSizeFromImageLike(
	file: File | FileMetadata,
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.onerror = reject;

		if (file instanceof File) {
			img.src = URL.createObjectURL(file);
		} else {
			img.src = file.url;
		}
	});
}

export function getImageFileSizeFromImageLike(
	file: File | FileMetadata,
): number {
	return file instanceof File ? file.size : file.size;
}
