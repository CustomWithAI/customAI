export function calculateReadingTime(text: string) {
	const wordsPerMinute = 200;
	const words = text.trim().split(/\s+/).length;
	const minutes = words / wordsPerMinute;

	return {
		minutes: Math.ceil(minutes),
		text: `${Math.ceil(minutes)} min read`,
	};
}
