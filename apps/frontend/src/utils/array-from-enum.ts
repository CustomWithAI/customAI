import type { EnumType } from "@/types/enum";

export function getArrayFromEnum(
	obj: EnumType | undefined,
	path: (string | undefined)[],
): (string | any)[] | null {
	let current: any = obj;
	for (const key of path) {
		if (!key || !current || typeof current !== "object") return null;
		if (key) current = current[key];
	}
	return Array.isArray(current) ? current : null;
}
