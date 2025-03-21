"use client";
import { DialogBuilder } from "@/components/builder/dialog";
import { ContentHeader, Header } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { SocialAccount } from "@/features/settings/section/social";
import { ViewSessionSection } from "@/features/settings/section/view-session";
import { useRevokeOtherSession } from "@/hooks/mutations/security-api";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/libs/auth-client";
import { Network } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export default function SecurityPage() {
	const t = useTranslations();
	const { mutateAsync: revokeOtherSession } = useRevokeOtherSession();

	const handleRevokeAllSession = useCallback(async () => {
		try {
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
		} catch (error) {
			console.warn(error);
		}
	}, []);

	const handleRevokeOtherSession = useCallback(async () => {
		try {
			await revokeOtherSession(undefined, {
				onSuccess: () =>
					toast({
						className: "bg-green-500 text-white",
						title: "revoke other sessions successfully",
					}),
				onError: (err: Error) =>
					toast({
						variant: "destructive",
						title: "failed to revoke other sessions",
						description: err.message,
					}),
			});
		} catch (error) {
			console.warn(error);
		}
	}, [revokeOtherSession]);

	return (
		<div className="flex flex-col gap-y-6">
			<Header className="w-full border-b border-gray-200">
				{t("Security.AccountSecurity")}
			</Header>
			<>
				<ContentHeader>Change email and password</ContentHeader>
				<div>
					<Button variant="outline" className="text-gray-600">
						change password
					</Button>
				</div>
				<div>
					<Button variant="outline" className="text-gray-600">
						change email
					</Button>
				</div>
				<ContentHeader className="flex gap-x-2">
					<Network /> Sessions
				</ContentHeader>
				<div>
					<DialogBuilder
						config={{
							trigger: (
								<Button variant="secondary" className="text-gray-600">
									view session activity
								</Button>
							),
							title: "All session activities",
							description: "list of session login into your account",
							body: <ViewSessionSection />,
						}}
					/>
				</div>
				<div>
					<Button
						onClick={handleRevokeOtherSession}
						variant="outline"
						className="text-red-500"
					>
						revoke other sessions
					</Button>
				</div>
				<div>
					<Button
						onClick={handleRevokeAllSession}
						variant="outline"
						className="text-red-500"
					>
						revoke all sessions
					</Button>
				</div>
			</>
			<Header className="w-full border-b border-gray-200">
				{t("Security.TwoFactorAuthentication")}
			</Header>
			<Header className="w-full border-b border-gray-200">
				{t("Security.LinkAccounts")}
			</Header>
			<SocialAccount />
		</div>
	);
}
