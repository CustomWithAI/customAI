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
		</div>
	);
}
