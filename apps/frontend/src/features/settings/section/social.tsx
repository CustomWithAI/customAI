import { BaseSkeleton } from "@/components/specific/skeleton";
import { Content, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { socials } from "@/configs/social";
import { env } from "@/env.mjs";
import { useSocialAccounts } from "@/hooks/queries/security-api";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/libs/auth-client";
import { cn } from "@/libs/utils";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const SocialAccount = () => {
	const { data, isPending } = useSocialAccounts();
	const locale = useLocale();
	const router = useRouter();
	const t = useTranslations();

	const handleLinkAccount = useCallback(
		async (provider: Exclude<(typeof socials)[number], "credential">) => {
			const { data: linkSocial } = await authClient.linkSocial(
				{
					provider: provider,
					callbackURL: `${env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/settings?tab=security`,
				},
				{
					onSuccess: (ctx) => {
						if (!ctx.data.url) {
							toast({ title: "unable to link social", variant: "destructive" });
							return;
						}
						router.push(ctx.data.url);
					},
					onError: (ctx) => {
						toast({
							title: "unable to link social",
							variant: "destructive",
							description: ctx.error.message,
						});
					},
				},
			);
		},
		[locale, router],
	);

	const handleSetPassword = () => {};

	return (
		<BaseSkeleton loading={isPending} template="line2">
			{socials.map((social) => {
				const account = data?.data?.find(
					(account) => account.provider === social,
				);
				return (
					<div key={social} className="grid grid-cols-3 w-full items-center">
						<Content>{social}</Content>
						<div>
							<Badge
								variant="secondary"
								className={cn(
									{ "text-green-600 bg-green-100/80": !!account },
									{ "text-gray-600 bg-gray-100/80": !account },
								)}
							>
								{account ? t("Security.connected") : t("Security.unknown")}
							</Badge>
						</div>

						{!account && (
							<div>
								<Button
									onClick={() => {
										if (social === "credential") {
											return handleSetPassword();
										}
										handleLinkAccount(social);
									}}
									variant="secondary"
								>
									{t("Security.linkWith")} {social}
								</Button>
							</div>
						)}
					</div>
				);
			})}
		</BaseSkeleton>
	);
};
