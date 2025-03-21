"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { Menubar } from "@/components/ui/menubar";
import { useQueryParam } from "@/hooks/use-query-params";
import { useTranslations } from "next-intl";
import { AppearancePage } from "./_container/Appearance";
import AccountPage from "./_container/account";
import SecurityPage from "./_container/security";

export default function Page() {
	const t = useTranslations();
	const { compareQueryParam, setQueryParam } = useQueryParam({ name: "tab" });
	return (
		<AppNavbar activeTab="Home" PageTitle="" disabledTab={undefined}>
			<div className="max-w-screen no-scroll overflow-x-scroll border-b border-gray-200 mb-4">
				<Menubar.List>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "account" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "account", allowNull: true })}
					>
						{t("Tab.Account")}
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "security" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "security" })}
					>
						{t("Tab.Security")}
					</Menubar.Item>
					<Menubar.Item
						onClick={() =>
							setQueryParam({
								params: { name: "tab", value: "appearance" },
								resetParams: true,
							})
						}
						current={compareQueryParam({ value: "appearance" })}
					>
						{t("Tab.Appearance")}
					</Menubar.Item>
				</Menubar.List>
			</div>
			{compareQueryParam({ value: "account", allowNull: true }) ? (
				<AccountPage />
			) : null}
			{compareQueryParam({ value: "security" }) ? <SecurityPage /> : null}
			{compareQueryParam({ value: "appearance" }) ? <AppearancePage /> : null}
		</AppNavbar>
	);
}
