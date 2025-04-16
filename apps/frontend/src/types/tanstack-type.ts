import type {
	InfiniteData,
	UseInfiniteQueryOptions,
	UseInfiniteQueryResult,
	UseMutationOptions,
	UseMutationResult,
	UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ResponseError } from "./response/common";

export type AppQueryOptions<T extends (...args: any) => any> = Partial<
	UseQueryOptions<
		Awaited<ReturnType<T>>,
		AxiosError<ResponseError>,
		Awaited<ReturnType<T>>
	>
>;

export type AppInfiniteQueryOptions<T extends (...args: any) => any> = Partial<
	UseInfiniteQueryOptions<
		Awaited<ReturnType<T>>,
		AxiosError<ResponseError>,
		Awaited<ReturnType<T>>,
		unknown
	>
>;

export type AppInfiniteQuery<T extends (...args: any) => any> =
	UseInfiniteQueryResult<
		InfiniteData<Awaited<ReturnType<T>> | undefined>,
		Error
	>;
export type MutateAsyncResult<T> = UseMutationResult<
	any,
	AxiosError<ResponseError>,
	T,
	unknown
>["mutateAsync"];

// cautions: need single parameter for types
export type AppMutationOptions<T extends (...args: any) => any> = Partial<
	UseMutationOptions<
		Awaited<ReturnType<T>>,
		AxiosError<ResponseError>,
		Parameters<T>[0]
	>
>;

export type AppInfiniteOptions<T extends (...args: any) => any> = Partial<
	UseInfiniteQueryOptions<
		Awaited<ReturnType<T>>,
		AxiosError,
		InfiniteData<Awaited<ReturnType<T>>>,
		Awaited<ReturnType<T>>,
		string[],
		Awaited<Parameters<T>>[0]
	>
>;
