import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type React from "react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Learning Platform",
	description: "A flexible learning platform built with Next.js and MDX",
};

export default async function LearningLayout({
	children,
	params,
}: { children: ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);
	return <div className="relative min-h-screen flex">{children}</div>;
}
