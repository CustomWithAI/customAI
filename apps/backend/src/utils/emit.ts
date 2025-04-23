export const emit = (text: string, success: boolean) =>
	`${JSON.stringify({ text, status: success ? "success" : ("failed" as const) })}\n`;
