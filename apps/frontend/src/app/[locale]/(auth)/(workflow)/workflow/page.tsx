"use client";
import { InfiniteTable } from "@/components/layout/InfinityTable";
import { AppNavbar } from "@/components/layout/appNavbar";
import { InfiniteGrid } from "@/components/layout/infinityGrid";
import { FilterDialog } from "@/components/specific/filter/dialog";
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
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useFilters } from "@/hooks/useFilter";
import {
	type FieldOptions,
	generateFilterOptions,
} from "@/libs/generateFilterOptions";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import type { FilterConfig } from "@/types/filter";
import type { WorkflowModel } from "@/types/response/workflow";
import { toText } from "@/utils/toCapital";
import { Filter, PackagePlus } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useState } from "react";

const filterConfig: FilterConfig<WorkflowModel> = {
	name: ["filter", "search", "sort"],
	type: ["filter", "search", "sort"],
	createdAt: ["sort"],
};

const fieldOptions: FieldOptions = {
	type: {
		filter: {
			type: "select",
			options: [
				{ value: "classification", label: "Classification" },
				{ value: "object_detection", label: "Object detection" },
				{ value: "segmentation", label: "Segmentation" },
			],
		},
	},
};

export default function Page() {
	const { asyncRoute } = useRouterAsync();
	const { relativeTime } = useFormatter();
	const [dialogOpen, setDialogOpen] = useState(false);

	const { filters, setFilter, resetFilters, getParams, setManualFilter } =
		useFilters({
			config: filterConfig,
		});

	const setFilterName = useDebounceCallback((name) =>
		setManualFilter("name", name, "search"),
	);
	const filterOptions = generateFilterOptions(filterConfig, fieldOptions);

	const handleCreate = useCallback(() => {
		asyncRoute("/workflow/create");
	}, [asyncRoute]);

	const workflowQuery = useGetInfWorkflows({
		params: getParams() as Record<string, string>,
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
							onChange={(v) => setFilterName(v.target.value)}
							className=" max-w-lg"
						/>
						<Button onClick={() => setDialogOpen(true)}>
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
			<FilterDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				filterOptions={filterOptions}
				values={filters}
				onApply={(key, value) => setFilter(key, value)}
				onReset={resetFilters}
			/>
		</AppNavbar>
	);
}
