"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routing } from "@/i18n/routings";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const languageNames = {};
export function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("languages");

	const switchLanguage = (newLocale: string) => {
		const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, "");
		router.push(`/${newLocale}${pathWithoutLocale}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="flex items-center gap-2">
					<Globe className="h-4 w-4" />
					{languageNames[locale as keyof typeof languageNames] || locale}
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
