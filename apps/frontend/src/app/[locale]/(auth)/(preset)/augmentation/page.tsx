"use client";
import { InfiniteTable } from "@/components/layout/InfinityTable";
import { AppNavbar } from "@/components/layout/appNavbar";
import { ViewList } from "@/components/specific/viewList";
import { Primary, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetInfAugmentation } from "@/hooks/queries/augmentation-api";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { Filter, PackagePlus } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useState } from "react";
import { toCapital } from "../../../../../utils/toCapital";

export default function Page() {
	const { asyncRoute } = useRouterAsync();
	const { relativeTime } = useFormatter();
	const [AugmentationName, setAugmentationName] = useDebounceValue<string>(
		"",
		500,
	);

	const handleCreate = useCallback(() => {
		asyncRoute("/workflow/create");
	}, [asyncRoute]);

	const AugmentationQuery = useGetInfAugmentation({
		params: { search: AugmentationName ? `name:${AugmentationName}` : null },
	});

	return (
		<AppNavbar activeTab="Home" PageTitle="home" disabledTab={undefined}>
			<div className="flex justify-between">
				<Primary className="mb-4">Data Augmentation</Primary>
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
							placeholder="search data augmentation ..."
							onChange={(v) => setAugmentationName(v.target.value)}
							className=" max-w-lg"
						/>
						<Button>
							<Filter /> filter
						</Button>
					</div>
				</div>
				<Subtle className="text-xs mb-3 font-medium">
					Found {AugmentationQuery?.data?.pages?.at?.(0)?.total}{" "}
					{(AugmentationQuery?.data?.pages?.at?.(0)?.total || 0) > 1
						? "data augmentations"
						: "data augmentation"}
				</Subtle>
				<InfiniteTable
					className="-mt-12"
					query={AugmentationQuery}
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
							href: (item) => `/augmentation/${item.id}`,
						},
						{
							header: "Process",
							accessorKey: "data",
							cell: (item) => (
								<>
									{(item.data?.priority as string[])?.length || 0}{" "}
									{((item.data?.priority as string[])?.length || 0) > 1
										? "augments"
										: "augment"}
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
					onRowClick={(item) => asyncRoute(`/augmentation/${item.id}`)}
				/>
			</ViewList.Provider>
		</AppNavbar>
	);
}
