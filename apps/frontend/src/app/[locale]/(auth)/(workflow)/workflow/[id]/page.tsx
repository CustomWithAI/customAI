"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { Menubar } from "@/components/ui/menubar";
import { useQueryParam } from "@/hooks/use-query-params";
import { MainWorkflowPage } from "./_container/main";

export default function Page() {
	const { compareQueryParam, setQueryParam } = useQueryParam({ name: "tab" });
	return (
		<AppNavbar activeTab="Home" PageTitle="" disabledTab={undefined}>
			<div className="max-w-screen no-scroll mb-4 overflow-x-scroll border-b">
				<Menubar.List>
					<Menubar.Item
						onClick={() =>
							setQueryParam({ value: "overview", resetParams: true })
						}
						current={compareQueryParam({ value: "overview", allowNull: true })}
					>
						Overview
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({ value: "insights", resetParams: true })
						}
						current={compareQueryParam({ value: "insights" })}
					>
						Insights
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({ value: "versions", resetParams: true })
						}
						current={compareQueryParam({ value: "versions" })}
					>
						Versions
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({ value: "contributors", resetParams: true })
						}
						current={compareQueryParam({ value: "contributors" })}
					>
						Contributors
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({ value: "settings", resetParams: true })
						}
						current={compareQueryParam({ value: "settings" })}
					>
						Settings
					</Menubar.Item>
				</Menubar.List>
			</div>
			{compareQueryParam({ value: "overview", allowNull: true }) ? (
				<MainWorkflowPage />
			) : null}
		</AppNavbar>
	);
}
