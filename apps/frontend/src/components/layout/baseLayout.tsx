import { Toaster } from "@/components/ui/toaster";
import UploadProgress from "@/features/dataset/components/uploadProgression";
import { FlowNavigationProvider } from "@/hooks/use-flow-navigation";
import { ReactQueryProvider } from "@/libs/react-query-providers";
import { cn } from "@/libs/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { IBM_Plex_Sans_Thai, Inter } from "next/font/google";
import type { ReactNode } from "react";

const ibm = IBM_Plex_Sans_Thai({
	subsets: ["latin", "thai"],
	display: "swap",
	variable: "--font-ibm",
	weight: ["200", "300", "400", "500", "600", "700"],
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
	return (
		<html suppressHydrationWarning className="h-full" lang={locale}>
			<head>
				{/* {process.env.NODE_ENV !== "production" && (
					<script
						crossOrigin="anonymous"
						src="//unpkg.com/react-scan/dist/auto.global.js"
					/>
				)} */}
			</head>
			<body
				className={cn(
					locale === "en-US" ? inter.className : ibm.className,
					"flex h-full flex-col",
				)}
			>
				<NextIntlClientProvider messages={messages}>
					<ReactQueryProvider>
						<FlowNavigationProvider>
							{children}
							<UploadProgress />
							<Toaster />
						</FlowNavigationProvider>
					</ReactQueryProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
