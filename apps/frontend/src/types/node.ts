import type { FormFields, SchemaType } from "@/components/builder/form";
import type { ZodDiscriminatedUnion, ZodObject, ZodRawShape, z } from "zod";

export type CustomNodeData<
	T extends ZodDiscriminatedUnion<string, any> | ZodRawShape = z.ZodRawShape,
> = {
	id: string;
	title: string;
	description: string;
	image: string;
	value: string;
	type: string;
	inputSchema?: SchemaType<T>;
	inputField?: FormFields<
		z.infer<
			| ZodObject<T extends ZodRawShape ? T : never>
			| ZodDiscriminatedUnion<any, any>
		>
	>[];
	onChange: (value: string) => void;
	onDelete?: () => void;
	onReset?: () => void;
};
