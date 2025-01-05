"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { ViewList } from "@/components/specific/viewList";
import { Primary } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentDataset } from "@/features/dataset/components/content";
import { Filter } from "lucide-react";
import { useState } from "react";

export default function Page() {
	return (
		<AppNavbar activeTab="Home" PageTitle="home" disabledTab={undefined}>
			<Primary className="mb-4">Workflow</Primary>
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
				<ContentDataset />
			</ViewList.Provider>
		</AppNavbar>
	);
}
