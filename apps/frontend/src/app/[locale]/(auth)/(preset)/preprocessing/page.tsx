"use client";
import { InfiniteTable } from "@/components/layout/InfinityTable";
import { AppNavbar } from "@/components/layout/appNavbar";
import { InfiniteGrid } from "@/components/layout/infinityGrid";
import { WindowList } from "@/components/layout/windowList";
import { ViewList } from "@/components/specific/viewList";
import { Primary, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkflowCard } from "@/features/workflow/components/content-workflow";
import { useGetInfPreprocessing } from "@/hooks/queries/preprocessing-api";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { Filter, PackagePlus } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useState } from "react";
import { toCapital } from "../../../../../utils/toCapital";

export default function Page() {
	const { asyncRoute } = useRouterAsync();
	const { relativeTime } = useFormatter();
	const [PreprocessingName, setPreprocessingName] = useDebounceValue<string>(
		"",
		500,
	);

	const handleCreate = useCallback(() => {
		asyncRoute("/workflow/create");
	}, [asyncRoute]);

	const preprocessingQuery = useGetInfPreprocessing({
		params: { search: PreprocessingName ? `name:${PreprocessingName}` : null },
	});

	return (
		<AppNavbar activeTab="Home" PageTitle="home" disabledTab={undefined}>
			<div className="flex justify-between">
				<Primary className="mb-4">Image Preprocessing</Primary>
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
							placeholder="search image preprocessing ..."
							onChange={(v) => setPreprocessingName(v.target.value)}
							className=" max-w-lg"
						/>
						<Button>
							<Filter /> filter
						</Button>
					</div>
					<ViewList.Trigger />
				</div>
				<Subtle className="text-xs mb-3 font-medium">
					Found {preprocessingQuery?.data?.pages?.at?.(0)?.total}{" "}
					{(preprocessingQuery?.data?.pages?.at?.(0)?.total || 0) > 1
						? "preprocessings"
						: "preprocessing"}
				</Subtle>
				<InfiniteTable
					className="-mt-12"
					query={preprocessingQuery}
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
							href: (item) => `/preprocessing/${item.id}`,
						},
						{
							header: "Process",
							accessorKey: "data",
							cell: (item) => (
								<>
									{item.data?.priority?.length || 0}{" "}
									{(item.data?.priority?.length || 0) > 1
										? "processes"
										: "process"}
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
					columnStyles={[
						{ column: "email", type: "italic" },
						{ column: "role", type: "numeric" },
					]}
					onRowClick={(user) => console.log("Row clicked:", user)}
				/>
			</ViewList.Provider>
		</AppNavbar>
	);
}
