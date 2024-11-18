"use client";
import { SingleBeam } from "@/components/common/single-beam";
import { HomeMenu } from "@/components/layout/homeMenu";
import { FeatureBento } from "@/features/homepage/components/feature";
import { HeaderMain } from "@/features/homepage/components/header";
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
			<HeaderMain />
			<FeatureBento />
		</div>
	);
}
