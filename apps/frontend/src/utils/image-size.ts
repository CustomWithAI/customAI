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
