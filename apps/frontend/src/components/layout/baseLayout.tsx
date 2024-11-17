import { Toaster } from "@/components/ui/toaster";
import { ReactQueryProvider } from "@/libs/react-query-providers";
import { cn } from "@/libs/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Lexend, Prompt } from "next/font/google";
import type { ReactNode } from "react";

const prompt = Prompt({
	weight: ["200", "300", "400", "500", "600", "700"],
	subsets: ["thai"],
	display: "swap",
});

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

type Props = {
	children: ReactNode;
	locale: string;
};

export default async function BaseLayout({ children, locale }: Props) {
	const messages = await getMessages();
	console.log(locale);
	return (
		<html suppressHydrationWarning className="h-full" lang={locale}>
			<body
				className={cn(
					locale === "en-US" ? inter.className : prompt.className,
					"flex h-full flex-col",
				)}
			>
				<NextIntlClientProvider messages={messages}>
					<ReactQueryProvider>
						{children}
						<Toaster />
					</ReactQueryProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
