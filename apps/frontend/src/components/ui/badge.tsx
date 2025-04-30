import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/libs/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70",
				outline:
					"text-foreground border-gray-200 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
			},
			color: {
				red: "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
				amber:
					"border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
				green:
					"border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
				blue: "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
			},
			effect: {
				pulse: "animate-pulse",
				blink: "animate-ping opacity-70",
				softBlink: "animate-pulse opacity-90",
				dot: "before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-current before:mr-1 before:inline-block before:animate-pulse",
				fadeIn: "opacity-80 hover:opacity-100",
				expand: "hover:scale-105 hover:px-3",
				elevate: "hover:translate-y-[-2px] hover:shadow-md",
				glow: "hover:brightness-110 hover:shadow-[0_0_5px_rgba(255,255,255,0.7)]",
				ring: "hover:ring-2 hover:ring-offset-1",
				softRing: "ring-1 ring-inset ring-white/10 hover:ring-white/30",
				softBorder: "border border-current/20 hover:border-current/40",
				floating: "animate-bounce-slow",
				pulseDot:
					"pl-4 before:content-[''] before:absolute before:left-1.5 before:top-[45%] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current before:animate-pulse relative",
				status:
					"pl-4 before:content-[''] before:absolute before:left-1.5 before:top-[45%] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current relative",
			},
			status: {
				online: "before:bg-green-500",
				offline: "before:bg-gray-400",
				away: "before:bg-amber-500",
				busy: "before:bg-red-500",
				new: "before:bg-blue-500",
			},
			size: {
				default: "text-xs px-2 py-0.5",
				sm: "text-xs px-1.5 py-0 rounded",
				lg: "text-sm px-2.5 py-1 rounded-md",
				xl: "text-base px-3 py-1.5 rounded-lg",
			},
		},
		defaultVariants: {
			variant: "default",
		},
		compoundVariants: [
			{
				variant: "outline",
				color: "red",
				className:
					"border-red-200 text-red-500 [a&]:hover:bg-red-50 [a&]:hover:text-red-600",
			},
			{
				variant: "outline",
				color: "green",
				className:
					"border-green-200 text-green-500 [a&]:hover:bg-green-50 [a&]:hover:text-green-600",
			},
			{
				variant: "outline",
				color: "blue",
				className:
					"border-blue-200 text-blue-500 [a&]:hover:bg-blue-50 [a&]:hover:text-blue-600",
			},
			{
				variant: "outline",
				color: "amber",
				className:
					"border-amber-200 text-amber-500 [a&]:hover:bg-amber-50 [a&]:hover:text-amber-600",
			},
			{
				variant: "secondary",
				color: "red",
				className: "bg-red-100 text-red-700 [a&]:hover:bg-red-200",
			},
			{
				variant: "secondary",
				color: "green",
				className: "bg-green-100 text-green-700 [a&]:hover:bg-green-200",
			},
			{
				variant: "secondary",
				color: "blue",
				className: "bg-blue-100 text-blue-700 [a&]:hover:bg-blue-200",
			},
			{
				variant: "secondary",
				color: "amber",
				className: "bg-amber-100 text-amber-700 [a&]:hover:bg-amber-200",
			},
		],
	},
);

function Badge({
	className,
	variant,
	effect,
	size,
	status,
	color,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(
				badgeVariants({ variant, effect, size, color, status }),
				className,
			)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
