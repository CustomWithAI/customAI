"use client";

import {
	HydrationBoundary,
	QueryClient,
	QueryClientProvider,
	dehydrate,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState } from "react";

type ReactQueryProviderProps = {
	children: ReactNode;
};

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						staleTime: 60 * 1000,
						refetchIntervalInBackground: false,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	const dehydratedState = dehydrate(queryClient);

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydratedState}>
				{children}
				{process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
			</HydrationBoundary>
		</QueryClientProvider>
	);
}
