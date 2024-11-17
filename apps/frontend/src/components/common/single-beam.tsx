"use client";

import { cn } from "@/libs/utils";
import { motion } from "framer-motion";
import React from "react";

export const SingleBeam = React.memo(
	({ className }: { className?: string }) => {
		return (
			<div
				className={cn(
					"absolute z-0 flex-1 w-full inset-0 [mask-size:40px] [mask-repeat:no-repeat] flex items-center justify-center",
					className,
				)}
			>
				<svg
					className="z-10 h-full w-full pointer-events-none absolute"
					width="100%"
					height="100%"
					viewBox="0 0 696 316"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Background pattern</title>
					<path
						d="M-380 -189L-380 -189 -312 216 152 453L616 470 684 875 684 875"
						stroke="url(#paint0_radial_242_278)"
						strokeOpacity="0.05"
						strokeWidth="0.5"
					/>
					<motion.path
						d="M-380 -189L-380 -189 -312 216 152 453L616 470 684 875 684 875"
						stroke={"url(#linearGradient-0)"}
						strokeOpacity="0.4"
						strokeWidth="0.5"
					/>
					<defs>
						<motion.linearGradient
							id={"linearGradient-single"}
							initial={{
								x1: "0%",
								x2: "0%",
								y1: "0%",
								y2: "0%",
							}}
							animate={{
								x1: ["0%", "100%"],
								x2: ["0%", "95%"],
								y1: ["0%", "100%"],
								y2: ["0%", `${93 + Math.random() * 8}%`],
							}}
							transition={{
								duration: Math.random() * 20 + 10,
								ease: "easeInOut",
								repeat: Number.POSITIVE_INFINITY,
								delay: Math.random() * 20,
							}}
						>
							<stop stopColor="#18CCFC" stopOpacity="0" />
							<stop stopColor="#18CCFC" />
							<stop offset="32.5%" stopColor="#6344F5" />
							<stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
						</motion.linearGradient>
						<radialGradient
							id="paint0_radial_242_278"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
						>
							<stop offset="0.0666667" stopColor="var(--neutral-300)" />
							<stop offset="0.243243" stopColor="var(--neutral-300)" />
							<stop offset="0.43594" stopColor="white" stopOpacity="0" />
						</radialGradient>
					</defs>
				</svg>
			</div>
		);
	},
);

SingleBeam.displayName = "SingleBeam";
