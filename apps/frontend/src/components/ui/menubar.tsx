"use client";

import { Link } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import { LayoutGroup, motion } from "framer-motion";
import React, { useId } from "react";
import { Button, type ButtonProps } from "./button";
import { TouchTarget } from "./touchTarget";

function MenubarList({
	className,
	...props
}: React.ComponentPropsWithoutRef<"nav">) {
	return (
		<nav
			{...props}
			className={cn(className, "flex flex-1 items-center gap-4 py-2.5")}
		/>
	);
}

function MenubarDivider({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			aria-hidden="true"
			{...props}
			className={cn(className, "h-6 w-px bg-zinc-950/10 dark:bg-white/10")}
		/>
	);
}

function MenubarSection({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const id = useId();
	return (
		<LayoutGroup id={id}>
			<div {...props} className={cn(className, "flex items-center gap-3")} />
		</LayoutGroup>
	);
}

function MenubarSpacer({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			aria-hidden="true"
			{...props}
			className={cn(className, "-ml-4 flex-1")}
		/>
	);
}

const MenubarItem = React.forwardRef(function MenubarItem(
	{
		current,
		className,
		children,
		...props
	}: {
		current?: boolean;
		className?: string;
		children: React.ReactNode;
	} & ButtonProps,
	ref: React.ForwardedRef<HTMLButtonElement>,
) {
	const classes = cn(
		// Base
		"relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-nowrap whitespace-nowrap text-left text-base/6 font-medium text-zinc-950 sm:text-sm/5",
		// Leading icon/icon-only
		"*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5",
		// Trailing icon (down chevron or similar)
		"*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4",
		// Avatar
		"*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius)] *:data-[slot=avatar]:[--ring-opacity:10%] sm:*:data-[slot=avatar]:size-6",
		// Hover
		"data-hover:bg-zinc-950/5 data-hover:*:data-[slot=icon]:fill-zinc-950",
		// Active
		"data-active:bg-zinc-950/5 data-active:*:data-[slot=icon]:fill-zinc-950",
		// Dark mode
		"dark:text-white dark:*:data-[slot=icon]:fill-zinc-400",
		"dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white",
		"dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-white",
	);

	return (
		<span className={cn(className, "relative")}>
			{current && (
				<motion.span
					layoutId="current-indicator"
					className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-zinc-950 dark:bg-white"
				/>
			)}
			<Button
				{...props}
				variant="ghost"
				className={cn("cursor-default", classes)}
				data-current={current ? "true" : undefined}
				ref={ref}
			>
				<TouchTarget>{children}</TouchTarget>
			</Button>
		</span>
	);
});

function MenubarLabel({
	className,
	...props
}: React.ComponentPropsWithoutRef<"span">) {
	return <span {...props} className={cn(className, "truncate")} />;
}

export const Menubar = {
	List: MenubarList,
	Divider: MenubarDivider,
	Section: MenubarSection,
	Spacer: MenubarSpacer,
	Item: MenubarItem,
	Label: MenubarLabel,
};
