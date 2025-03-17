"use client";
import {
	ContentHeader,
	Italic,
	SubHeader,
	Subtle,
} from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { authClient } from "@/libs/auth-client";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { cn } from "@/libs/utils";
import { Check, Earth, Leaf, Plane, Rocket, Sprout, Wind } from "lucide-react";
import { useCallback, useState } from "react";

const NewUserPage = () => {
	const { asyncRoute, isLoadingRoute } = useRouterAsync();
	const [selected, setSelected] = useState<
		"beginner" | "intermediate" | "expert" | null
	>(null);

	const handleSubmit = useCallback(async () => {
		if (selected === null) return;
		await authClient.updateUser({
			experience: selected as string,
		});
		await asyncRoute("/home");
	}, [asyncRoute, selected]);

	return (
		<div className="p-6 md:w-3/4 m-auto max-w-screen-2xl h-3/4 space-y-6">
			<SubHeader>Get Started in Just a Few Steps</SubHeader>
			<Subtle>What’s Your Experience Level?</Subtle>
			<div className=" grid grid-cols-3 gap-x-6">
				<button
					type="button"
					onClick={() => setSelected("beginner")}
					className={cn(
						"relative group border hover:border-green-500 hover:bg-green-50 rounded-lg p-6 duration-150",
						{ "border-green-500 bg-green-50": selected === "beginner" },
					)}
				>
					{selected === "beginner" && (
						<div className="absolute top-4 right-4 rounded-full bg-green-500">
							<Check className="w-5 h-5 m-1.5 text-white shadow-sm" />
						</div>
					)}
					<div className="relative w-full aspect-square">
						<Leaf
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-8 group-hover:translate-y-4 group-hover:rotate-12",
								"group-hover:size-4 duration-300 ease-in-out text-green-500",
								{
									"translate-x-8 translate-y-4 rotate-12 size-4":
										selected === "beginner",
								},
							)}
						/>
						<Leaf
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:-translate-x-12 group-hover:-translate-y-6 group-hover:rotate-45",
								"group-hover:size-3 duration-500 ease-in-out text-green-500",
								{
									"-translate-x-12 -translate-y-6 rotate-45 size-3":
										selected === "beginner",
								},
							)}
						/>
						<Leaf
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-4 group-hover:-translate-y-14 group-hover:-rotate-90",
								"group-hover:size-2 duration-200 ease-in-out text-green-500",
								{
									"translate-x-4 -translate-y-14 -rotate-90 size-2":
										selected === "beginner",
								},
							)}
						/>
						<Sprout
							className={cn(
								"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 group-hover:size-16",
								"duration-200 ease-in-out text-green-500",
								{
									"size-16": selected === "beginner",
								},
							)}
							size={32}
						/>
					</div>
					<ContentHeader>Beginner</ContentHeader>
					<Italic>New to automation? We’ll guide you.</Italic>
				</button>
				<button
					type="button"
					onClick={() => setSelected("intermediate")}
					className={cn(
						"relative group border hover:border-blue-500 hover:bg-blue-50 rounded-lg p-6 duration-150",
						{ "border-blue-500 bg-blue-50": selected === "intermediate" },
					)}
				>
					{selected === "intermediate" && (
						<div className="absolute top-4 right-4 rounded-full bg-blue-500">
							<Check className="w-5 h-5 m-1.5 text-white shadow-sm" />
						</div>
					)}
					<div className="relative w-full aspect-square">
						<Wind
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-8 group-hover:translate-y-1 group-hover:rotate-12",
								"group-hover:size-4 duration-300 ease-in-out text-blue-500",
								{
									"translate-x-8 translate-y-1 rotate-12 size-4":
										selected === "intermediate",
								},
							)}
						/>
						<Wind
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:-translate-x-12 group-hover:-translate-y-2 group-hover:-rotate-45",
								"group-hover:size-3 duration-500 ease-in-out text-blue-500",
								{
									"-translate-x-12 -translate-y-2 -rotate-45 size-3":
										selected === "intermediate",
								},
							)}
						/>
						<Wind
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-4 group-hover:-translate-y-14 group-hover:-rotate-90",
								"group-hover:size-2 duration-200 ease-in-out text-blue-500",
								{
									"translate-x-4 -translate-y-14 -rotate-90 size-2":
										selected === "intermediate",
								},
							)}
						/>
						<Plane
							className={cn(
								"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 group-hover:size-16",
								"duration-200 ease-in-out text-blue-500",
								{
									"size-16": selected === "intermediate",
								},
							)}
							size={32}
						/>
					</div>
					<ContentHeader>Intermediate</ContentHeader>
					<Italic>I’ve used tools before but want something simpler.</Italic>
				</button>
				<button
					type="button"
					onClick={() => setSelected("expert")}
					className={cn(
						"relative group border hover:border-violet-500 hover:bg-violet-50 rounded-lg p-6 duration-150",
						{ "border-blue-500 bg-blue-50": selected === "expert" },
					)}
				>
					{selected === "expert" && (
						<div className="absolute top-4 right-4 rounded-full bg-violet-500">
							<Check className="w-5 h-5 m-1.5 text-white shadow-sm" />
						</div>
					)}
					<div className="relative w-full aspect-square">
						<Earth
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-8 group-hover:translate-y-3 group-hover:rotate-12",
								"group-hover:size-4 duration-300 ease-in-out text-violet-500",
								{
									"translate-x-8 translate-y-3 rotate-12 size-4":
										selected === "expert",
								},
							)}
						/>
						<Earth
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:-translate-x-12 group-hover:-translate-y-6 group-hover:-rotate-45",
								"group-hover:size-3 duration-500 ease-in-out text-violet-500",
								{
									"-translate-x-12 -translate-y-6 -rotate-45 size-3":
										selected === "expert",
								},
							)}
						/>
						<Earth
							className={cn(
								"absolute top-1/2 left-1/2 size-0 group-hover:-translate-x-2 group-hover:-translate-y-12 group-hover:-rotate-90",
								"group-hover:size-2 duration-200 ease-in-out text-violet-500",
								{
									"-translate-x-2 -translate-y-12 -rotate-90":
										selected === "expert",
								},
							)}
						/>
						<Rocket
							className={cn(
								"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 group-hover:size-16",
								"duration-200 ease-in-out text-violet-500",
								{
									"size-16": selected === "expert",
								},
							)}
							size={32}
						/>
					</div>
					<ContentHeader>Expert</ContentHeader>
					<Italic className="">I know my way around APIs and workflows.</Italic>
				</button>
			</div>
			<div className="w-full flex justify-center">
				<Button onClick={handleSubmit} disabled={!selected || isLoadingRoute}>
					Next
				</Button>
			</div>
		</div>
	);
};

export default NewUserPage;
