"use client";

import {
	HydrationBoundary,
	QueryClient,
	QueryClientProvider,
	dehydrate,
	keepPreviousData,
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
						placeholderData: keepPreviousData,
						refetchIntervalInBackground: false,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				{children}
				<ReactQueryDevtools />
			</HydrationBoundary>
		</QueryClientProvider>
	);
}
