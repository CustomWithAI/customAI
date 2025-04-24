"use client";
import { InfiniteTable } from "@/components/layout/InfinityTable";
import { AppNavbar } from "@/components/layout/appNavbar";
import { InfiniteGrid } from "@/components/layout/infinityGrid";
import { ViewList } from "@/components/specific/viewList";
import { Primary, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentDataset } from "@/features/dataset/components/content";
import { WorkflowCard } from "@/features/workflow/components/content-workflow";
import {
	useGetInfWorkflows,
	useGetWorkflows,
} from "@/hooks/queries/workflow-api";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { buildQueryParams } from "@/utils/build-param";
import { toCapital, toText } from "@/utils/toCapital";
import { Filter, PackagePlus } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useState } from "react";

export default function Page() {
	const { asyncRoute } = useRouterAsync();
	const { relativeTime } = useFormatter();
	const [workflowName, setWorkflowName] = useDebounceValue<string>("", 500);

	const handleCreate = useCallback(() => {
		asyncRoute("/workflow/create");
	}, [asyncRoute]);

	const workflowQuery = useGetInfWorkflows({
		params: { search: workflowName ? `name:${workflowName}` : null },
	});

	return (
		<AppNavbar activeTab="Home" PageTitle="home" disabledTab={undefined}>
			<div className="flex justify-between">
				<Primary className="mb-4">Workflow</Primary>
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
							placeholder="search workflows ..."
							onChange={(v) => setWorkflowName(v.target.value)}
							className=" max-w-lg"
						/>
						<Button>
							<Filter /> filter
						</Button>
					</div>
					<ViewList.Trigger />
				</div>
				<Subtle className="text-xs mb-3 font-medium">
					Found {workflowQuery?.data?.pages?.at?.(0)?.total}{" "}
					{(workflowQuery?.data?.pages?.at?.(0)?.total || 0) > 1
						? "workflows"
						: "workflow"}
				</Subtle>
				<ViewList.Vertical>
					<InfiniteTable
						className="-mt-12"
						query={workflowQuery}
						keyField="id"
						bordered={true}
						striped={true}
						clickableRows={true}
						columns={[
							{
								header: "Name",
								accessorKey: "name",
								type: "bold",
								href: (item) => `/workflow/${item.id}`,
							},
							{
								header: "Description",
								accessorKey: "description",
							},
							{
								header: "Type",
								accessorKey: "type",
								cell(item) {
									return toText(item.type);
								},
							},
							{
								header: "Created At",
								accessorKey: "createdAt",
								type: "muted",
								cell: (item) => relativeTime(new Date(item.createdAt)),
							},
						]}
						onRowClick={(item) => asyncRoute(`/workflow/${item.id}`)}
					/>
				</ViewList.Vertical>
				<ViewList.Grid>
					<InfiniteGrid
						query={workflowQuery}
						columns="auto"
						renderItem={(item, index) => (
							<WorkflowCard
								href={`workflow/${item.id}`}
								key={item.id}
								{...item}
							/>
						)}
					/>
				</ViewList.Grid>
			</ViewList.Provider>
		</AppNavbar>
	);
}
