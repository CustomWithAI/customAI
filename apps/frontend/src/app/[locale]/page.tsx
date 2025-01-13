"use client";
import { HomeMenu } from "@/components/layout/homeMenu";
import { FeatureBento } from "@/features/homepage/components/feature";
import { Footer } from "@/features/homepage/components/footer";
import { HeaderMain } from "@/features/homepage/components/header";
import { Pricing } from "@/features/homepage/components/pricing";
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
			<Pricing />
			<Footer />
		</div>
	);
}
