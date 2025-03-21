"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { Menubar } from "@/components/ui/menubar";
import { useGetTrainingByDefault } from "@/hooks/queries/training-api";
import { useGetWorkflowById } from "@/hooks/queries/workflow-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { InsightPage } from "./_container/insight";
import { MainWorkflowPage } from "./_container/main";
import { SettingPage } from "./_container/setting";
import { VersionPage } from "./_container/version";

export default function Page({ params: { id } }: { params: { id: string } }) {
	const { compareQueryParam, setQueryParam } = useQueryParam({ name: "tab" });

	const { data: workflow } = useGetWorkflowById(id);
	const { data: defaultTraining } = useGetTrainingByDefault(id);
	return (
		<AppNavbar
			activeTab="Home"
			PageTitle={workflow?.data.name || ""}
			disabledTab={undefined}
		>
			<div className="max-w-screen no-scroll mb-4 overflow-x-scroll border-b border-gray-200">
				<Menubar.List>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "overview" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "overview", allowNull: true })}
					>
						Overview
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "insights" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "insights" })}
					>
						Insights
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "versions" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "versions" })}
					>
						Versions
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "contributors" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "contributors" })}
					>
						Contributors
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "settings" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "settings" })}
					>
						Settings
					</Menubar.Item>
				</Menubar.List>
			</div>
			{compareQueryParam({ value: "overview", allowNull: true }) ? (
				<MainWorkflowPage
					data={workflow?.data}
					default={defaultTraining?.data}
				/>
			) : null}
			{compareQueryParam({ value: "versions" }) ? (
				<VersionPage id={id} />
			) : null}
			{compareQueryParam({ value: "insights" }) ? <InsightPage /> : null}
			{compareQueryParam({ value: "settings" }) ? <SettingPage /> : null}
		</AppNavbar>
	);
}
