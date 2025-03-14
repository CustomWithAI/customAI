import type { Metadata } from "next";
import type React from "react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Learning Platform",
	description: "A flexible learning platform built with Next.js and MDX",
};

export default function LearningLayout({ children }: { children: ReactNode }) {
	return <div className="relative min-h-screen flex">{children}</div>;
}
