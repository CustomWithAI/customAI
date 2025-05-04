"use client";
import {
	ContentHeader,
	Italic,
	SubHeader,
	Subtle,
} from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import InterestedSelector from "@/features/newUser/interested";
import { authClient, useSession } from "@/libs/auth-client";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { cn } from "@/libs/utils";
import { Check, Earth, Leaf, Plane, Rocket, Sprout, Wind } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Step = {
	id: number;
	title: string;
	subtitle: string;
};

const steps: Step[] = [
	{
		id: 1,
		title: "Experience Level",
		subtitle: "Tell us about your automation experience",
	},
	{
		id: 2,
		title: "Interests",
		subtitle: "What would you like to automate?",
	},
];

const NewUserPage = () => {
	const { asyncRoute, isLoadingRoute } = useRouterAsync();
	const { data: session, isPending } = useSession();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<{
		experience: "beginner" | "intermediate" | "expert" | null;
		interests: string[];
	}>({
		experience: null,
		interests: [],
	});

	useEffect(() => {
		const redirect = async () => {
			if (!isPending && session?.user?.experience) {
				await asyncRoute("/home");
			}
		};
		redirect();
	}, [isPending, session?.user, asyncRoute]);

	const handleNext = useCallback(() => {
		if (currentStep < steps.length) {
			setCurrentStep((prev) => prev + 1);
		}
	}, [currentStep]);

	const handleBack = useCallback(() => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	}, [currentStep]);

	const handleSubmit = useCallback(async () => {
		if (!formData.experience) return;
		await authClient.updateUser({
			experience: formData.experience as string,
		});
		await asyncRoute("/home");
	}, [asyncRoute, formData.experience]);

	const updateFormData = useCallback(
		<T,>(
			field: "experience" | "interests",
			value: T | ((prevState: T) => T),
		) => {
			setFormData((prev) => ({
				...prev,
				[field]:
					typeof value === "function"
						? (value as (prevState: T) => T)(prev[field] as T)
						: value,
			}));
		},
		[],
	);

	const renderExperienceStep = () => (
		<div className="grid grid-cols-3 max-sm:grid-cols-1 gap-x-6">
			<button
				type="button"
				onClick={() => updateFormData("experience", "beginner")}
				className={cn(
					"relative group border border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-lg p-6 duration-150",
					{
						"border-green-500 bg-green-50": formData.experience === "beginner",
					},
				)}
			>
				{formData.experience === "beginner" && (
					<div className="absolute top-4 right-4 rounded-full bg-green-500">
						<Check className="w-5 h-5 m-1.5 text-white shadow-xs" />
					</div>
				)}
				<div className="relative w-full aspect-square">
					<Leaf
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-8 group-hover:translate-y-4 group-hover:rotate-12",
							"group-hover:size-4 duration-300 ease-in-out text-green-500",
							{
								"translate-x-8 translate-y-4 rotate-12 size-4":
									formData.experience === "beginner",
							},
						)}
					/>
					<Leaf
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:-translate-x-12 group-hover:-translate-y-6 group-hover:rotate-45",
							"group-hover:size-3 duration-500 ease-in-out text-green-500",
							{
								"-translate-x-12 -translate-y-6 rotate-45 size-3":
									formData.experience === "beginner",
							},
						)}
					/>
					<Leaf
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-4 group-hover:-translate-y-14 group-hover:-rotate-90",
							"group-hover:size-2 duration-200 ease-in-out text-green-500",
							{
								"translate-x-4 -translate-y-14 -rotate-90 size-2":
									formData.experience === "beginner",
							},
						)}
					/>
					<Sprout
						className={cn(
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 group-hover:size-16",
							"duration-200 ease-in-out text-green-500",
							{
								"size-16": formData.experience === "beginner",
							},
						)}
						size={32}
					/>
				</div>
				<ContentHeader>Beginner</ContentHeader>
				<Italic>New to automation? We'll guide you.</Italic>
			</button>
			<button
				type="button"
				onClick={() => updateFormData("experience", "intermediate")}
				className={cn(
					"relative group border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg p-6 duration-150",
					{
						"border-blue-500 bg-blue-50":
							formData.experience === "intermediate",
					},
				)}
			>
				{formData.experience === "intermediate" && (
					<div className="absolute top-4 right-4 rounded-full bg-blue-500">
						<Check className="w-5 h-5 m-1.5 text-white shadow-xs" />
					</div>
				)}
				<div className="relative w-full aspect-square">
					<Wind
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-8 group-hover:translate-y-1 group-hover:rotate-12",
							"group-hover:size-4 duration-300 ease-in-out text-blue-500",
							{
								"translate-x-8 translate-y-1 rotate-12 size-4":
									formData.experience === "intermediate",
							},
						)}
					/>
					<Wind
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:-translate-x-12 group-hover:-translate-y-2 group-hover:-rotate-45",
							"group-hover:size-3 duration-500 ease-in-out text-blue-500",
							{
								"-translate-x-12 -translate-y-2 -rotate-45 size-3":
									formData.experience === "intermediate",
							},
						)}
					/>
					<Wind
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-4 group-hover:-translate-y-14 group-hover:-rotate-90",
							"group-hover:size-2 duration-200 ease-in-out text-blue-500",
							{
								"translate-x-4 -translate-y-14 -rotate-90 size-2":
									formData.experience === "intermediate",
							},
						)}
					/>
					<Plane
						className={cn(
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 group-hover:size-16",
							"duration-200 ease-in-out text-blue-500",
							{
								"size-16": formData.experience === "intermediate",
							},
						)}
						size={32}
					/>
				</div>
				<ContentHeader>Intermediate</ContentHeader>
				<Italic>I've used tools before but want something simpler.</Italic>
			</button>
			<button
				type="button"
				onClick={() => updateFormData("experience", "expert")}
				className={cn(
					"relative group border border-gray-200 hover:border-violet-500 hover:bg-violet-50 rounded-lg p-6 duration-150",
					{
						"border-violet-500 bg-violet-50": formData.experience === "expert",
					},
				)}
			>
				{formData.experience === "expert" && (
					<div className="absolute top-4 right-4 rounded-full bg-violet-500">
						<Check className="w-5 h-5 m-1.5 text-white shadow-xs" />
					</div>
				)}
				<div className="relative w-full aspect-square">
					<Earth
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:translate-x-8 group-hover:translate-y-3 group-hover:rotate-12",
							"group-hover:size-4 duration-300 ease-in-out text-violet-500",
							{
								"translate-x-8 translate-y-3 rotate-12 size-4":
									formData.experience === "expert",
							},
						)}
					/>
					<Earth
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:-translate-x-12 group-hover:-translate-y-6 group-hover:-rotate-45",
							"group-hover:size-3 duration-500 ease-in-out text-violet-500",
							{
								"-translate-x-12 -translate-y-6 -rotate-45 size-3":
									formData.experience === "expert",
							},
						)}
					/>
					<Earth
						className={cn(
							"absolute top-1/2 left-1/2 size-0 group-hover:-translate-x-2 group-hover:-translate-y-12 group-hover:-rotate-90",
							"group-hover:size-2 duration-200 ease-in-out text-violet-500",
							{
								"-translate-x-2 -translate-y-12 -rotate-90 size-2":
									formData.experience === "expert",
							},
						)}
					/>
					<Rocket
						className={cn(
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 group-hover:size-16",
							"duration-200 ease-in-out text-violet-500",
							{
								"size-16": formData.experience === "expert",
							},
						)}
						size={32}
					/>
				</div>
				<ContentHeader>Expert</ContentHeader>
				<Italic>I know my way around APIs and workflows.</Italic>
			</button>
		</div>
	);

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return renderExperienceStep();
			case 2:
				return (
					<InterestedSelector
						selected={formData.interests || []}
						setSelected={(data) => {
							updateFormData("interests", data);
						}}
					/>
				);
			default:
				return null;
		}
	};

	const isNextDisabled = () => {
		switch (currentStep) {
			case 1:
				return !formData.experience;
			case 2:
				return formData.interests.length === 0;
			default:
				return true;
		}
	};

	if (isPending) return null;

	return (
		<div className="p-6 md:w-2/3 m-auto max-w-(--breakpoint-2xl) h-3/4 space-y-6">
			<div className="space-y-2">
				<SubHeader>{steps[currentStep - 1].title}</SubHeader>
				<Subtle>{steps[currentStep - 1].subtitle}</Subtle>
			</div>

			{renderStepContent()}

			<div className="w-full flex justify-between mt-8">
				{currentStep > 1 && (
					<Button
						variant="outline"
						onClick={handleBack}
						disabled={isLoadingRoute}
					>
						Back
					</Button>
				)}
				<div className="flex-1" />
				<Button
					onClick={currentStep === steps.length ? handleSubmit : handleNext}
					disabled={isNextDisabled() || isLoadingRoute}
				>
					{currentStep === steps.length ? "Finish" : "Next"}
				</Button>
			</div>
		</div>
	);
};

export default NewUserPage;
