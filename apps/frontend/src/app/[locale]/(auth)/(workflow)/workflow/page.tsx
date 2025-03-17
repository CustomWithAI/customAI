"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { ViewList } from "@/components/specific/viewList";
import { Primary, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentDataset } from "@/features/dataset/components/content";
import { WorkflowCard } from "@/features/workflow/components/content-workflow";
import { useGetWorkflows } from "@/hooks/queries/workflow-api";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { Filter, PackagePlus } from "lucide-react";
import { useCallback } from "react";

export default function Page() {
	const { asyncRoute } = useRouterAsync();

	const handleCreate = useCallback(() => {
		asyncRoute("/workflow/create");
	}, [asyncRoute]);

	const { data: workflows } = useGetWorkflows();

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
						<Input placeholder="search datasets ..." className=" max-w-lg" />
						<Button className="bg-indigo-900 hover:bg-indigo-950 dark:opacity-40 dark:bg-indigo-900 dark:hover:bg-indigo-950">
							<Filter /> filter
						</Button>
					</div>
					<ViewList.Trigger />
				</div>
				<Subtle className="text-xs mb-3 font-medium">
					Found {workflows?.data.total}{" "}
					{(workflows?.data.total || 0) > 1 ? "workflows" : "workflow"}
				</Subtle>
				<div className="grid grid-cols-4 gap-4">
					{workflows?.data.data.map((workflow) => {
						return (
							<WorkflowCard
								href={`workflow/${workflow.id}`}
								key={workflow.id}
								{...workflow}
							/>
						);
					})}
				</div>
			</ViewList.Provider>
		</AppNavbar>
	);
}
