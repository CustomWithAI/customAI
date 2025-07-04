export const encodeBase64 = (value: string): string =>
	Buffer.from(value).toString("base64");

export function decodeBase64(value: string): string;
export function decodeBase64(value: string | null): string | null;

export function decodeBase64(value: string | null): string | null {
	if (!value) {
		return null;
	}
	return Buffer.from(value, "base64").toString("utf8");
}
