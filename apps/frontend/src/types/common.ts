export type responsePagination<T extends object> = {
	data: T[];
	nextCursor: string | undefined;
	perviousCursor: string | undefined;
	total: number;
};
