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
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useState } from "react";
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
	const form = useForm<SignUpSchemaType>({
		resolver: zodResolver(SignUpSchema),
		mode: "onTouched",
	});

	async function onSubmit(data: SignUpSchemaType) {
		try {
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
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("AuthForm.password")}</FormLabel>
											<FormControl>
												<Input {...field} id="password" type="password" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("AuthForm.confirmpassword")}</FormLabel>
											<FormControl>
												<Input {...field} id="password" type="password" />
											</FormControl>
											<FormMessage className="relative h-4" />
										</FormItem>
									)}
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
							className="hover:underline flex mx-auto mt-5 text-center"
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
