"use client";
import { ContentHeader, Header } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { SocialAccount } from "@/features/settings/section/social";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/libs/auth-client";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export default function SecurityPage() {
	const t = useTranslations();

	const handleRevokeAllSession = useCallback(async () => {
		const { data: status } = await authClient.revokeSessions({
			fetchOptions: {
				onSuccess: (ctx) => {
					toast({
						className: "bg-green-500 text-white",
						title: "revoke all sessions successfully",
					});
				},
			},
		});
	}, []);

	return (
		<div className="flex flex-col gap-y-6">
			<Header className="w-full border-b">
				{t("Security.AccountSecurity")}
			</Header>
			<>
				<ContentHeader>change email and password</ContentHeader>
				<div>
					<Button variant="outline">change password</Button>
				</div>
				<div>
					<Button variant="outline">change email</Button>
				</div>
				<div>
					<Button
						onClick={handleRevokeAllSession}
						variant="outline"
						className="text-red-500"
					>
						revoke all session
					</Button>
				</div>
			</>
			<Header className="w-full border-b">
				{t("Security.TwoFactorAuthentication")}
			</Header>
			<Header className="w-full border-b">{t("Security.LinkAccounts")}</Header>
			<SocialAccount />
		</div>
	);
}
