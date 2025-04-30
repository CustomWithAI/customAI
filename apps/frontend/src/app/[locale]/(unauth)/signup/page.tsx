"use client";
import { HomeMenu } from "@/components/layout/homeMenu";
import { Header, Subtle } from "@/components/typography/text";
import { SubHeader } from "@/components/typography/text";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/ui/loading-button";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/libs/auth-client";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { useRouter } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import { SignUpSchema, type SignUpSchemaType } from "@/models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowRight,
	CheckIcon,
	EyeIcon,
	EyeOffIcon,
	XIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function Signup() {
	return (
		<Suspense fallback={<div>a</div>}>
			<SignupPage />
		</Suspense>
	);
}
function SignupPage() {
	const t = useTranslations();
	const { toast } = useToast();
	const { asyncRoute } = useRouterAsync();
	const router = useRouter();
	const locale = useLocale();
	const [state, setState] = useState<"idle" | "loading" | "success">("idle");
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const form = useForm<SignUpSchemaType>({
		resolver: zodResolver(SignUpSchema),
		mode: "onTouched",
	});

	const toggleVisibility = () => setIsVisible((prevState) => !prevState);

	const getStrengthColor = (score: number) => {
		if (score === 0) return "bg-border";
		if (score <= 1) return "bg-red-500";
		if (score <= 2) return "bg-orange-500";
		if (score === 3) return "bg-amber-500";
		return "bg-emerald-500";
	};

	const getStrengthText = (score: number) => {
		if (score === 0) return "Enter a password";
		if (score <= 2) return "Weak password";
		if (score === 3) return "Medium password";
		return "Strong password";
	};

	const checkStrength = (pass: string) => {
		const requirements = [
			{ regex: /.{8,}/, text: "At least 8 characters" },
			{ regex: /[0-9]/, text: "At least 1 number" },
			{ regex: /[a-z]/, text: "At least 1 lowercase letter" },
			{ regex: /[A-Z]/, text: "At least 1 uppercase letter" },
		];

		return requirements.map((req) => ({
			met: req.regex.test(pass),
			text: req.text,
		}));
	};

	async function onSubmit(data: SignUpSchemaType) {
		try {
			if (checkStrength(data.password).filter((req) => req.met).length < 4) {
				return;
			}
			const { data: authData, error } = await authClient.signUp.email(
				{
					name: data.name,
					email: data.email,
					password: data.password,
				},
				{
					onRequest: () => {
						setState("loading");
					},
					onSuccess: async (ctx) => {
						await asyncRoute("/signin");
						setState("success");
						toast({
							className: "bg-green-500 text-white",
							title: "create account successfully",
						});
					},
					onError: (ctx) => {
						setState("idle");
						toast({
							variant: "destructive",
							title: "create account failed",
							description: ctx.error.message,
						});
					},
				},
			);
		} catch (err) {
			console.error(err);
		}
	}
	return (
		<>
			<BackgroundBeams className="bg-white dark:bg-zinc-700/20" />
			<div className="flex z-0 flex-col justify-center h-full w-full">
				<div
					className={cn(
						"p-12 2xl:px-20 2xl:py-24 max-md:w-full dark:bg-white/10 bg-transparent max-md:h-full",
						"md:backdrop-blur-xs md:rounded-md md:shadow-lg w-fit mx-auto flex flex-col",
						"justify-center text-center items-center",
					)}
				>
					<SubHeader>{t("HomePage.signup")}</SubHeader>
					<Subtle className="mt-1 mb-4">
						{t("SignUp.signup_description")}
					</Subtle>
					<div className="w-full mt-4 max-w-xs flex flex-col space-y-3">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-3 pb-3 text-left"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("AuthForm.name")}</FormLabel>
											<FormControl>
												<Input {...field} id="name" type="text" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("AuthForm.email")}</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="example@example.com"
													id="email"
													type="email"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field: { onChange, value } }) => {
										const strength = checkStrength(
											typeof value === "undefined" ? "" : value,
										);

										const strengthScore = useMemo(() => {
											return strength.filter((req) => req.met).length;
										}, [strength]);
										return (
											<FormItem>
												<FormLabel>{t("AuthForm.password")}</FormLabel>
												<FormControl>
													<div className="relative">
														<Input
															id="password"
															className="pe-9"
															placeholder="Password"
															type={isVisible ? "text" : "password"}
															value={value}
															onChange={onChange}
															aria-describedby="password-description"
														/>
														<button
															className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
															type="button"
															onClick={toggleVisibility}
															aria-label={
																isVisible ? "Hide password" : "Show password"
															}
															aria-pressed={isVisible}
															aria-controls="password"
														>
															{isVisible ? (
																<EyeOffIcon size={16} aria-hidden="true" />
															) : (
																<EyeIcon size={16} aria-hidden="true" />
															)}
														</button>
													</div>
												</FormControl>
												<div
													className="bg-border mt-3 mb-2.5 h-1 w-full overflow-hidden rounded-full"
													aria-valuenow={strengthScore}
													aria-valuemin={0}
													aria-valuemax={4}
													aria-label="Password strength"
												>
													<div
														className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
														style={{ width: `${(strengthScore / 4) * 100}%` }}
													/>
												</div>

												<p
													id="password-description"
													className="text-foreground mb-1 text-sm font-medium"
												>
													{getStrengthText(strengthScore)}. Must contain:
												</p>

												<ul
													className="space-y-1.5 mb-4"
													aria-label="Password requirements"
												>
													{strength.map((req, index) => (
														<li key={index} className="flex items-center gap-2">
															{req.met ? (
																<CheckIcon
																	size={16}
																	className="text-emerald-500"
																	aria-hidden="true"
																/>
															) : (
																<XIcon
																	size={16}
																	className="text-muted-foreground/80"
																	aria-hidden="true"
																/>
															)}
															<span
																className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
															>
																{req.text}
																<span className="sr-only">
																	{req.met
																		? " - Requirement met"
																		: " - Requirement not met"}
																</span>
															</span>
														</li>
													))}
												</ul>
											</FormItem>
										);
									}}
								/>
								<ButtonLoading
									className="w-full"
									name="LocaleLayout.signup"
									loading={state}
									type="submit"
								/>
							</form>
						</Form>
						<button
							type="button"
							onClick={() => router.push("/signin")}
							className="hover:underline flex mx-auto text-center"
						>
							<p className="text-nowrap mt-1 text-xs hover:text-blue-800">
								{t("SignUp.have_account")}
							</p>
							<ArrowRight className="ml-2 w-3" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
