"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { ViewList } from "@/components/specific/viewList";
import { Primary } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentDataset } from "@/features/dataset/components/content";
import { useGetDatasets } from "@/hooks/queries/dataset-api";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { Filter, PackagePlus } from "lucide-react";
import { useCallback, useState } from "react";

export default function Page() {
	const { asyncRoute } = useRouterAsync();
	const { data: datasets, isPending: datasetsPending } = useGetDatasets();

	const handleCreate = useCallback(() => {
		asyncRoute("/dataset/create");
	}, [asyncRoute]);

	return (
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
						<Input placeholder="search datasets ..." className=" max-w-lg" />
						<Button>
							<Filter /> filter
						</Button>
					</div>
					<ViewList.Trigger />
				</div>
				<ContentDataset datasets={datasets?.data} total={datasets?.total} />
			</ViewList.Provider>
		</AppNavbar>
	);
}
