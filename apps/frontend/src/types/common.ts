export type ResponsePagination<T extends object> = {
	data: T[];
	nextCursor: string | undefined;
	prevCursor: string | undefined;
	total: number;
};

export type NotNull<T> = T extends null | undefined ? never : T;
