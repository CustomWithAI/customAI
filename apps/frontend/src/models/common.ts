import { z } from "zod";

export const float = z
	.string()
	.regex(/^\d+\.0$/, "Must end with .0")
	.transform(Number);
