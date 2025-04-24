export type FilterCapability = "filter" | "search" | "sort";

export type FilterConfig<T> = {
	[K in keyof T]?: FilterCapability[];
};

export type FilterValue = {
	[key: string]: any;
};

export type FilterParams = {
	search?: string | null;
	filter?: Record<string, any> | null;
	sort?: string | null;
};
