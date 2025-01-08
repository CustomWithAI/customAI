"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { Menubar } from "@/components/ui/menubar";
import UploadFile from "@/components/ui/uploadfile";
import { useQueryParam } from "@/hooks/use-query-params";

export default function Page() {
	const { compareQueryParam, setQueryParam } = useQueryParam({ name: "tab" });
	return (
		<AppNavbar activeTab="Home" PageTitle="" disabledTab={undefined}>
			<div className="max-w-screen no-scroll mb-4 overflow-x-scroll border-b">
				<Menubar.List>
					<Menubar.Item
						onClick={() => setQueryParam({ value: "roles", resetParams: true })}
						current={compareQueryParam({ value: "roles", allowNull: true })}
					>
						account roles
					</Menubar.Item>
					<Menubar.Item
						onClick={() => setQueryParam({ value: "roles", resetParams: true })}
						current={compareQueryParam({ value: "roles" })}
					>
						develop roles
					</Menubar.Item>
					<Menubar.Item
						onClick={() => setQueryParam({ value: "roles", resetParams: true })}
						current={compareQueryParam({ value: "roles" })}
					>
						fees
					</Menubar.Item>
				</Menubar.List>
			</div>
			{compareQueryParam({ value: "roles", allowNull: true }) ? <></> : null}
			<UploadFile id="" onFileChange={() => {}} />
		</AppNavbar>
	);
}
