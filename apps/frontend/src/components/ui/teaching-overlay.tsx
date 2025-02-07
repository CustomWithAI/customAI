"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

interface Offset {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
}

interface Step {
	target: string;
	title: string;
	description: string;
	position: "top" | "bottom" | "left" | "right";
	offset?: Offset;
	padding?: Offset;
	borderRadius?: number;
	minSize?: {
		width?: number;
		height?: number;
	};
}

const steps: Step[] = [
	{
		target: "#search-bar",
		title: "Search Anything",
		description:
			"Use the search bar to find what you're looking for quickly and easily.",
		position: "bottom",
		offset: { top: -4, right: -8, bottom: -4, left: -8 },
		padding: { left: 16, right: 16 },
		borderRadius: 8,
	},
	{
		target: "#user-menu",
		title: "Your Profile",
		description: "Access your account settings and preferences here.",
		position: "bottom",
		minSize: { width: 48, height: 48 },
		padding: { top: 8, bottom: 8, right: 8, left: 8 },
		borderRadius: 24,
	},
	{
		target: "#sidebar",
		title: "Navigation Menu",
		description: "Find all the important sections of the app in the sidebar.",
		position: "right",
		padding: { right: 24 },
		offset: { left: -2, right: 2 },
	},
];

export function TeachingOverlay() {
	const [currentStep, setCurrentStep] = React.useState(0);
	const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null);
	const [isExiting, setIsExiting] = React.useState(false);

	useEffect(() => {
		const updatePosition = () => {
			const target = document.querySelector(steps[currentStep].target);
			if (target) {
				const rect = target.getBoundingClientRect();
				setTargetRect(rect);
			}
		};

		updatePosition();
		window.addEventListener("resize", updatePosition);
		return () => window.removeEventListener("resize", updatePosition);
	}, [currentStep]);

	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === "Space" || event.key === "RightArrow") {
				handleNext();
			}
			if (event.key === "Backspace" || event.key === "LeftArrow") {
				handlePrevious();
			}
			if (event.key === "Escape") {
				handleClose();
			}
		};

		window.addEventListener("keydown", handleKeydown);
		return () => window.removeEventListener("keydown", handleKeydown);
	}, []);

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleClose = () => {
		setIsExiting(true);
	};

	const getMessagePosition = () => {
		if (!targetRect) return {};

		const padding = 20;
		const messageWidth = 300;
		const messageHeight = 150;

		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		let top = 0;
		let left = 0;

		switch (steps[currentStep].position) {
			case "top":
				top = Math.max(padding, targetRect.top - messageHeight - padding);
				left = Math.min(
					viewportWidth - messageWidth - padding,
					Math.max(
						padding,
						targetRect.left + targetRect.width / 2 - messageWidth / 2,
					),
				);
				break;
			case "bottom":
				top = Math.min(
					viewportHeight - messageHeight - padding,
					targetRect.bottom + padding,
				);
				left = Math.min(
					viewportWidth - messageWidth - padding,
					Math.max(
						padding,
						targetRect.left + targetRect.width / 2 - messageWidth / 2,
					),
				);
				break;
			case "left":
				top = Math.min(
					viewportHeight - messageHeight - padding,
					Math.max(
						padding,
						targetRect.top + targetRect.height / 2 - messageHeight / 2,
					),
				);
				left = Math.max(padding, targetRect.left - messageWidth - padding);
				break;
			case "right":
				top = Math.min(
					viewportHeight - messageHeight - padding,
					Math.max(
						padding,
						targetRect.top + targetRect.height / 2 - messageHeight / 2,
					),
				);
				left = Math.min(
					viewportWidth - messageWidth - padding,
					targetRect.right + padding,
				);
				break;
		}

		return { top, left };
	};

	const getHoleRect = () => {
		if (!targetRect) return null;

		const step = steps[currentStep];
		if (!step) return null;

		const offset = step.offset || {};
		const padding = step.padding || {};
		const minSize = step.minSize || {};

		const width = Math.max(
			minSize.width || 0,
			targetRect.width + (padding.left || 0) + (padding.right || 0),
		);
		const height = Math.max(
			minSize.height || 0,
			targetRect.height + (padding.top || 0) + (padding.bottom || 0),
		);

		const left = targetRect.left - (offset.left || 0) - (padding.left || 0);
		const top = targetRect.top - (offset.top || 0) - (padding.top || 0);

		return {
			x: left,
			y: top,
			width,
			height,
			radius: step.borderRadius || 4,
		};
	};

	if (!targetRect) return null;

	const holeRect = getHoleRect();
	const messagePosition = getMessagePosition();

	return (
		<AnimatePresence mode="wait">
			{!isExiting && (
				<>
					{/* Animated overlay with hole */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50"
					>
						<svg
							className="w-full h-full"
							style={{
								position: "absolute",
								top: 0,
								left: 0,
							}}
						>
							<defs>
								<mask id="hole">
									<rect width="100%" height="100%" fill="white" />
									{holeRect && (
										<motion.rect
											initial={false}
											animate={{
												x: holeRect.x,
												y: holeRect.y,
												width: holeRect.width,
												height: holeRect.height,
												rx: holeRect.radius,
											}}
											transition={{
												type: "spring",
												damping: 30,
												stiffness: 300,
											}}
											fill="black"
										/>
									)}
								</mask>
							</defs>
							<rect
								width="100%"
								height="100%"
								fill="rgba(0, 0, 0, 0.6)"
								mask="url(#hole)"
							/>
						</svg>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{
							type: "spring",
							damping: 25,
							stiffness: 300,
						}}
						style={{
							position: "fixed",
							zIndex: 50,
							...messagePosition,
						}}
					>
						<Card className="w-[300px] bg-white p-4 shadow-lg pointer-events-auto">
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
								className="mb-4"
							>
								<h3 className="text-lg font-semibold text-gray-900">
									{steps[currentStep].title}
								</h3>
								<p className="text-sm text-gray-600">
									{steps[currentStep].description}
								</p>
							</motion.div>
							<div className="flex items-center justify-between">
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handlePrevious}
										disabled={currentStep === 0}
									>
										<ChevronLeft className="mr-1 h-4 w-4" />
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleNext}
										disabled={currentStep === steps.length - 1}
									>
										Next
										<ChevronRight className="ml-1 h-4 w-4" />
									</Button>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={handleClose}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</Card>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
