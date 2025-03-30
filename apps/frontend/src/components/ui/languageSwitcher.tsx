"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routing } from "@/i18n/routings";
import { usePathname, useRouter } from "@/libs/i18nNavigation";
import { getPrefixLang } from "@/utils/getPrefixLang";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const languageNames = {};
export function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const locale = useLocale();
	const searchParams = useSearchParams();

	const params = new URLSearchParams(searchParams.toString());
	const t = useTranslations("languages");

	const switchLanguage = (newLocale: string) => {
		router.replace(`${pathname}?${params.toString()}`, {
			locale: getPrefixLang(newLocale),
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="flex items-center gap-2">
					<Globe className="h-4 w-4" />
					{languageNames[locale as keyof typeof languageNames] ||
						t(locale as "en-US" | "th-TH")}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{routing.locales.map((loc) => (
					<DropdownMenuItem
						key={loc}
						onClick={() => switchLanguage(loc)}
						className={loc === locale ? "bg-accent font-medium" : ""}
					>
						{languageNames[loc as keyof typeof languageNames] || t(loc)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
