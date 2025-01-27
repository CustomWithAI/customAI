"use client";
import { HomeMenu } from "@/components/layout/homeMenu";
import { SubHeader, Subtle } from "@/components/typography/text";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
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
import { useRouterAsync } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import { LoginSchema, type LoginSchemaType } from "@/models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
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
	const locale = useLocale();
	const { asyncRoute, isLoadingRoute } = useRouterAsync();
	const [state, setState] = useState<"idle" | "loading" | "success">("idle");
	const form = useForm<LoginSchemaType>({
		resolver: zodResolver(LoginSchema),
		mode: "onTouched",
	});
	const signinGoogle = async () => {
		try {
			const { data, error } = await authClient.signIn.social({
				provider: "google",
				callbackURL: `/${locale.split("-")[0]}/home`,
			});
			if (error) {
				toast({
					variant: "destructive",
					title: "authenticate failed",
					description: error.message,
				});
				return;
			}
		} catch (err) {
			console.error(err);
		}
	};

	async function onSubmit(data: LoginSchemaType) {
		try {
			const { data: auth, error } = await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
				},
				{
					onRequest: () => {
						setState("loading");
					},
					onSuccess: async (ctx) => {
						if (ctx.data.user?.experience) {
							await asyncRoute("/home");
						} else {
							await asyncRoute("/new-user");
						}
						setState("success");
						toast({
							className: "bg-green-500 text-white",
							title: "authenticate successfully",
							description: `welcome back, ${ctx.data.user.email}`,
						});
					},
					onError: (ctx) => {
						setState("idle");
						toast({
							variant: "destructive",
							title: "authenticate failed",
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
						"md:backdrop-blur-sm md:rounded-md md:shadow-lg w-fit mx-auto flex flex-col",
						"justify-center text-center items-center",
					)}
				>
					<SubHeader>{t("HomePage.login")}</SubHeader>
					<Subtle className="mb-4">{t("Login.login_description")}</Subtle>
					<div className="w-full mt-4 max-w-xs flex flex-col space-y-3">
						<Button onClick={signinGoogle} className="w-full">
							<IconBrandGoogle /> {t("Login.signInWithGoogle")}
						</Button>
						<Button className="w-full">
							<IconBrandGithub /> {t("Login.signInWithGitHub")}
						</Button>
						<div className="inline-flex space-x-3 pt-3 pb-1 items-center">
							<div className="border w-full h-0" />
							<p className=" text-zinc-400 text-xs font-extralight w-max flex-1 text-nowrap">
								{t("Login.orSignInWithEmail")}
							</p>
							<div className="border w-full h-0" />
						</div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-3 pb-3 text-left"
							>
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
											<FormMessage className="relative h-4" />
										</FormItem>
									)}
								/>
								<ButtonLoading
									className="w-full"
									name="LocaleLayout.login"
									loading={state}
									type="submit"
								/>
							</form>
						</Form>
						<button
							type="button"
							disabled={isLoadingRoute}
							onClick={() => asyncRoute("/signup")}
							className="hover:underline flex mx-auto mt-5 text-center"
						>
							<p className="text-nowrap mt-1 text-xs hover:text-blue-800">
								{t("Login.create_account")}
							</p>
							<ArrowRight className="ml-2 w-3" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
