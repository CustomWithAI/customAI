import { z } from "zod";

export const float = z.union([
	z
		.string()
		.regex(/^\d+\.0$/, "Must end with .0")
		.transform(Number),
	z.number(),
]);
