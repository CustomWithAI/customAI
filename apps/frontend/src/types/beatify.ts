export type Beautify<T> = T extends (infer U)[]
	? Beautify<U>[]
	: T extends object
		? { [K in keyof T]: Beautify<T[K]> }
		: T;
