"use client";
import { InfiniteTable } from "@/components/layout/InfinityTable";
import { AppNavbar } from "@/components/layout/appNavbar";
import { ViewList } from "@/components/specific/viewList";
import { Primary, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetInfFeatureEx } from "@/hooks/queries/feature-api";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { Filter, PackagePlus } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useState } from "react";
import { toCapital } from "../../../../../utils/toCapital";

export default function Page() {
	const { asyncRoute } = useRouterAsync();
	const { relativeTime } = useFormatter();
	const [FeatureName, setFeatureName] = useDebounceValue<string>("", 500);

	const handleCreate = useCallback(() => {
		asyncRoute("/workflow/create");
	}, [asyncRoute]);

	const FeatureQuery = useGetInfFeatureEx({
		params: { search: FeatureName ? `name:${FeatureName}` : null },
	});

	return (
		<AppNavbar activeTab="Home" PageTitle="home" disabledTab={undefined}>
			<div className="flex justify-between">
				<Primary className="mb-4">Feature Extraction and Selection</Primary>
				<Button
					onClick={handleCreate}
					variant="outline"
					className="text-indigo-700 mt-1.5 border-indigo-700 hover:text-indigo-950"
				>
					<PackagePlus /> Create
				</Button>
			</div>
			<ViewList.Provider>
				<div className="flex justify-between mb-2">
					<div className="flex space-x-4 w-full">
						<Input
							placeholder="search feature extraction and selection ..."
							onChange={(v) => setFeatureName(v.target.value)}
							className=" max-w-lg"
						/>
						<Button>
							<Filter /> filter
						</Button>
					</div>
				</div>
				<Subtle className="text-xs mb-3 font-medium">
					Found {FeatureQuery?.data?.pages?.at?.(0)?.total}{" "}
					{(FeatureQuery?.data?.pages?.at?.(0)?.total || 0) > 1
						? "Features"
						: "Feature"}
				</Subtle>
				<InfiniteTable
					className="-mt-12"
					query={FeatureQuery}
					keyField="id"
					bordered={true}
					striped={true}
					clickableRows={true}
					columns={[
						{
							header: "Name",
							accessorKey: "name",
							type: "bold",
							cell: (item) => toCapital(item.name),
							href: (item) => `/feature/${item.id}`,
						},
						{
							header: "Process",
							accessorKey: "data",
							cell: (item) => (
								<>
									{(item.data?.priority as string[])?.length || 0}{" "}
									{((item.data?.priority as string[])?.length || 0) > 1
										? "features"
										: "feature"}
								</>
							),
						},
						{
							header: "Created At",
							accessorKey: "createdAt",
							type: "muted",
							cell: (item) => relativeTime(new Date(item.createdAt)),
						},
					]}
					onRowClick={(item) => asyncRoute(`/feature/${item.id}`)}
				/>
			</ViewList.Provider>
		</AppNavbar>
	);
}
