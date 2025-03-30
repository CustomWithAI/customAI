"use client";

import { cn } from "@/libs/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";

const aiImagePlatformUses = [
	"Custom Art Generation",
	"AI-Powered Avatars",
	"AI Style Transfer",
	"Photo Enhancement",
	"AI-Generated Ads & Banners",
	"Product Mockups",
	"Social Media Content",
	"Logo & Branding Design",
	"AI Outfit Try-On",
	"Home & Interior Visualization",
	"Product Background Removal",
	"Visual Storytelling",
	"Interactive Learning",
	"Historical Image Restoration",
	"AI Comic & Manga Creator",
	"Movie Poster & Thumbnail Generator",
	"Character & Concept Art",
	"AI-Generated Architectural Designs",
	"Medical Imaging Assistance",
	"Security & Surveillance",
];

const transitionProps = {
	type: "spring",
	stiffness: 500,
	damping: 30,
	mass: 0.5,
};

export default function InterestedSelector({
	selected,
	setSelected,
}: { selected: string[]; setSelected: Dispatch<SetStateAction<string[]>> }) {
	const toggleInterested = (interest: string) => {
		setSelected((prev) =>
			prev.includes(interest)
				? prev.filter((c) => c !== interest)
				: [...prev, interest],
		);
	};
	return (
		<>
			<div className="mx-auto">
				<motion.div
					className="flex flex-wrap gap-3 overflow-visible"
					layout
					transition={{
						type: "spring",
						stiffness: 500,
						damping: 30,
						mass: 0.5,
					}}
				>
					{aiImagePlatformUses.map((propose) => {
						const isSelected = selected?.includes(propose);
						return (
							<motion.button
								key={propose}
								onClick={() => toggleInterested(propose)}
								layout
								initial={false}
								animate={{
									backgroundColor: isSelected ? "#2a1711" : "#ffffff",
								}}
								whileHover={{
									backgroundColor: isSelected ? "#2a1711" : "#ffffff",
								}}
								whileTap={{
									backgroundColor: isSelected ? "#1f1209" : "#ffffff",
								}}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30,
									mass: 0.5,
									backgroundColor: { duration: 0.1 },
								}}
								className={cn(
									"inline-flex items-center px-4 py-2 rounded-full text-sm font-medium",
									" whitespace-nowrap overflow-hidden ring-1 ring-inset border",
									isSelected
										? "text-[#ff9066] ring-[hsla(0,0%,100%,0.12)]"
										: "text-gray-700 ring-[hsla(0,0%,100%,0.06)]",
								)}
							>
								<motion.div
									className="relative flex items-center"
									animate={{
										width: isSelected ? "auto" : "100%",
										paddingRight: isSelected ? "1.5rem" : "0",
									}}
									transition={{
										ease: [0.175, 0.885, 0.32, 1.275],
										duration: 0.3,
									}}
								>
									<span>{propose}</span>
									<AnimatePresence>
										{isSelected && (
											<motion.span
												initial={{ scale: 0, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												exit={{ scale: 0, opacity: 0 }}
												transition={{
													type: "spring",
													stiffness: 500,
													damping: 30,
													mass: 0.5,
												}}
												className="absolute right-0"
											>
												<div className="w-4 h-4 rounded-full bg-[#ff9066] flex items-center justify-center">
													<Check
														className="w-3 h-3 text-[#2a1711]"
														strokeWidth={1.5}
													/>
												</div>
											</motion.span>
										)}
									</AnimatePresence>
								</motion.div>
							</motion.button>
						);
					})}
				</motion.div>
			</div>
		</>
	);
}
