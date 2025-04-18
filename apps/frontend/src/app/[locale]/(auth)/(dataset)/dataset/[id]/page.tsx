"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { FlowNavigator } from "@/components/specific/flowNavigation";
import { Menubar } from "@/components/ui/menubar";
import { useGetDataset } from "@/hooks/queries/dataset-api";
import { useQueryParam } from "@/hooks/use-query-params";
import ImagesPage from "./_container/images";
import DatasetManagement from "./_container/management";

export default function Page({ params: { id } }: { params: { id: string } }) {
	const { compareQueryParam, setQueryParam } = useQueryParam({ name: "tab" });
	const { data: dataset } = useGetDataset(id);
	return (
		<AppNavbar
			activeTab="Home"
			PageTitle={`${dataset?.name || ""} ${dataset?.annotationMethod ? `(${dataset?.annotationMethod.split("_")?.join(" ")})` : ""}`}
			disabledTab={undefined}
		>
			<FlowNavigator title="Dataset Page - 2" collectParams showButtons />
			<div className="max-w-screen no-scroll overflow-x-scroll border-b border-gray-200 mb-4">
				<Menubar.List>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "images" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "images", allowNull: true })}
					>
						images
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
						settings
					</Menubar.Item>
				</Menubar.List>
			</div>
			{compareQueryParam({ value: "images", allowNull: true }) ? (
				<ImagesPage id={id} />
			) : null}
			{compareQueryParam({ value: "settings" }) ? (
				<DatasetManagement dataset={dataset} />
			) : null}
		</AppNavbar>
	);
}
