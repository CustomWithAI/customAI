"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { Menubar } from "@/components/ui/menubar";
import { useQueryParam } from "@/hooks/use-query-params";
import ImagesPage from "./_container/images";
import DatasetManagement from "./_container/management";

export default function Page() {
	const { compareQueryParam, setQueryParam } = useQueryParam({ name: "tab" });
	return (
		<AppNavbar activeTab="Home" PageTitle="" disabledTab={undefined}>
			<div className="max-w-screen no-scroll overflow-x-scroll border-b mb-4">
				<Menubar.List>
					<Menubar.Item
						onClick={() =>
							setQueryParam({ value: "images", resetParams: true })
						}
						current={compareQueryParam({ value: "images", allowNull: true })}
					>
						images
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({ value: "settings", resetParams: true })
						}
						current={compareQueryParam({ value: "settings" })}
					>
						settings
					</Menubar.Item>
				</Menubar.List>
			</div>
			{compareQueryParam({ value: "images", allowNull: true }) ? (
				<ImagesPage />
			) : null}
			{compareQueryParam({ value: "settings" }) ? <DatasetManagement /> : null}
		</AppNavbar>
	);
}
