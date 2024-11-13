"use client";
import { HomeMenu } from "@/components/layout/homeMenu";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function Home() {
	return (
		<Suspense fallback={<div>a</div>}>
			<HomePage />
		</Suspense>
	);
}
function HomePage() {
	const t = useTranslations("HomePage");
	return (
		<div className="min-h-full w-full">
			<HomeMenu />
			<div className="h-[50rem] top-0 z-0 w-full dark:bg-black bg-white  dark:bg-grid-white/[0.03] bg-grid-black/[0.03] relative flex items-center justify-center">
				<div>a</div>
			</div>
		</div>
	);
}
