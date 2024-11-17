"use client";
import { HomeMenu } from "@/components/layout/homeMenu";
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
import { useRouter } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import { SignUpSchema, type SignUpSchemaType } from "@/models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
	const router = useRouter();
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
					onSuccess: () => {
						setState("success");
						toast({
							title: "create account successfully",
							description: `welcome back, ${authData?.user.email}`,
						});
						router.push("/signin");
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
			<HomeMenu />
			<BackgroundBeams className="bg-zinc-50 dark:bg-zinc-700/20" />
			<div className="flex z-0 flex-col justify-center pb-10 h-full w-full">
				<div
					className={cn(
						"py-12 px-8 lg:px-20 lg:py-24 max-md:w-full dark:bg-white/10 bg-white/40 max-md:h-full",
						"md:backdrop-blur-sm md:rounded-md md:shadow-sm w-fit mx-auto flex flex-col",
						"justify-center text-center items-center",
					)}
				>
					<h1 className="font-semibold text-xl">{t("HomePage.signup")}</h1>
					<p className=" text-zinc-600 font-light text-sm mb-4">
						{t("SignUp.signup_description")}
					</p>
					<div className="w-full max-w-xs flex flex-col space-y-3">
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
