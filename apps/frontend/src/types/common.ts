export type responsePagination<T extends object> = {
	data: T[];
	nextCursor: string | undefined;
	prevCursor: string | undefined;
	total: number;
};
