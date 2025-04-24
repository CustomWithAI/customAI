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
import { DatasetCard } from "@/features/dataset/components/gridBox";
import { useGetDatasets, useGetInfDatasets } from "@/hooks/queries/dataset-api";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useFilters } from "@/hooks/useFilter";
import {
	type FieldOptions,
	generateFilterOptions,
} from "@/libs/generateFilterOptions";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import type { FilterConfig } from "@/types/filter";
import type { ResponseDataset } from "@/types/response/dataset";
import { Filter, PackagePlus } from "lucide-react";
import { useFormatter } from "next-intl";
import { useCallback, useState } from "react";

const filterConfig: FilterConfig<ResponseDataset> = {
	name: ["filter", "search", "sort"],
	annotationMethod: ["filter", "search", "sort"],
	createdAt: ["sort"],
};

const fieldOptions: FieldOptions = {
	annotationMethod: {
		type: "select",
		options: [
			{ value: "classification", label: "classification" },
			{ value: "object detection", label: "object_detection" },
			{ value: "segmentation", label: "segmentation" },
		],
	},
};

export default function Page() {
	const { asyncRoute } = useRouterAsync();
	const { data: datasets, isPending: datasetsPending } = useGetDatasets();
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
		asyncRoute("/dataset/create");
	}, [asyncRoute]);

	const { relativeTime } = useFormatter();
	const datasetQuery = useGetInfDatasets({
		params: getParams() as Record<string, string>,
	});
	return (
		<>
			<AppNavbar activeTab="Home" PageTitle="home" disabledTab={undefined}>
				<div className="flex justify-between">
					<Primary className="mb-4">Dataset</Primary>
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
								placeholder="search datasets ..."
								onChange={(v) => setFilterName(v.target.value)}
								className=" max-w-lg"
							/>
							<Button onClick={() => setDialogOpen(true)}>
								<Filter /> filter
							</Button>
						</div>
						<ViewList.Trigger />
					</div>
					<div>
						<Subtle className="text-xs mb-3 font-medium">
							Found {datasets?.total || 0}{" "}
							{(datasets?.total || 0) > 1 ? "datasets" : "dataset"}
						</Subtle>
						<ViewList.Grid>
							<InfiniteGrid
								query={datasetQuery}
								columns="auto"
								renderItem={(item, index) => (
									<DatasetCard
										key={index}
										title={item.name}
										description={item.description}
										imagesCount={item.imageCount}
										href={`dataset/${item.id}`}
										images={item.images}
									/>
								)}
							/>
						</ViewList.Grid>
						<ViewList.Vertical>
							<InfiniteTable
								className="-mt-12"
								query={datasetQuery}
								keyField="id"
								bordered={true}
								striped={true}
								clickableRows={true}
								columns={[
									{
										header: "Name",
										accessorKey: "name",
										type: "bold",
										href: (item) => `/dataset/${item.id}`,
									},
									{
										header: "Description",
										accessorKey: "description",
									},
									{
										header: "Image",
										accessorKey: "imageCount",
										cell(item) {
											return `${item.imageCount} image${item.imageCount ? "s" : ""}`;
										},
									},
									{
										header: "Created At",
										accessorKey: "createdAt",
										type: "muted",
										cell: (item) => relativeTime(new Date(item.createdAt)),
									},
								]}
								onRowClick={(user) => console.log("Row clicked:", user)}
							/>
						</ViewList.Vertical>
					</div>
				</ViewList.Provider>
			</AppNavbar>
			<FilterDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				filterOptions={filterOptions}
				values={filters}
				onApply={(key, value) => setFilter(key, value)}
				onReset={resetFilters}
			/>
		</>
	);
}
