export type ResponseError = {};

export type OnlyNumberKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

/**
 * rewrite any level deeper than key
 */
export type DebugType<T> = {
	[K in keyof T]: T[K] extends object ? DebugType<T[K]> : T[K];
};

/**
 * type of any level nested of `key`
 */
export type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType &
		(string | number)]: ObjectType[Key] extends (infer U extends object)[]
		? `${Key}` | `${Key}.${number}` | `${Key}.${number}.${NestedKeyOf<U>}`
		: ObjectType[Key] extends object
			? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
			: `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * type of the `value` at any nested key, which complements `NestedKeyOf`.
 */
export type NestedValueOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		? NestedValueOf<ObjectType[Key]>
		: ObjectType[Key];
}[keyof ObjectType & (string | number)];

/**
 * similar to `NestedKeyOf`, but it also allows for `nullable` (null | undefined) values at any level.
 */
export type NullableNestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType &
		(string | number)]: ObjectType[Key] extends (infer U extends object)[]
		?
				| `${Key}`
				| `${Key}.${number}`
				| `${Key}.${number}.${NullableNestedKeyOf<U>}`
		: ObjectType[Key] extends object
			? `${Key}` | `${Key}.${NullableNestedKeyOf<ObjectType[Key]>}`
			: `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * makes all properties and nested properties `optional`.
 */
export type DeepPartial<ObjectType> = {
	[Key in keyof ObjectType]?: ObjectType[Key] extends object
		? DeepPartial<ObjectType[Key]>
		: ObjectType[Key];
};

/**
 * makes all properties and nested properties `require`, opposite to `DeepPartial`.
 */
export type DeepRequire<ObjectType> = {
	[Key in keyof ObjectType]-?: ObjectType[Key] extends object
		? DeepRequire<ObjectType[Key]>
		: ObjectType[Key];
};

/**
 * extracts the type of data property from an `object` if it exists, or returns `undefined`
 */
export type ExtractedDataType<T> = T extends { data: infer D } ? D : undefined;
