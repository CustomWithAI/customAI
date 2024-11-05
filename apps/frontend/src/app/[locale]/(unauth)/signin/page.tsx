"use client";
import { HomeMenu } from "@/components/layout/homeMenu";
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
import { useRouter } from "@/libs/i18nNavigation";
import { LoginSchema, type LoginSchemaType } from "@/models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

export default function Signup({
	params: { locale },
}: { params: { locale: string } }) {
	return (
		<Suspense fallback={<div>a</div>}>
			<SignupPage locale={locale} />
		</Suspense>
	);
}
function SignupPage({ locale }: { locale: string }) {
	const t = useTranslations();
	const { toast } = useToast();
	const router = useRouter();
	const [state, setState] = useState<"idle" | "loading" | "success">("idle");
	const form = useForm<LoginSchemaType>({
		resolver: zodResolver(LoginSchema),
		mode: "onTouched",
	});

	const signinGoogle = async () => {
		const { data, error } = await authClient.signIn.social({
			provider: "google",
			callbackURL: `/${locale}/overview`,
		});
		if (error) {
			toast({
				variant: "destructive",
				title: "authenticate failed",
				description: error.message,
			});
			return;
		}
	};

	async function onSubmit(data: LoginSchemaType) {
		const { data: authData, error } = await authClient.signIn.email(
			{
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
						title: "authenticate successfully",
						description: `welcome back, ${authData?.user.email}`,
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
	}
	return (
		<>
			<HomeMenu />
			<div className="pb-10 h-full w-full">
				<div className="flex flex-col justify-center w-full h-full items-center">
					<h1 className="font-medium text-lg">{t("HomePage.login")}</h1>
					<p className=" text-zinc-600 font-light text-sm mb-4">
						{t("Login.login_description")}
					</p>
					<div className="w-full max-w-xs flex flex-col space-y-3">
						<Button onClick={signinGoogle} className="w-full">
							<IconBrandGoogle /> {t("Login.signinwithgoogle")}
						</Button>
						<Button className="w-full">
							<IconBrandGithub /> {t("Login.signinwithgithub")}
						</Button>
						<div className="inline-flex space-x-3 pt-3 pb-1 items-center">
							<div className="border w-full h-0" />
							<p className=" text-zinc-400 text-xs font-extralight w-max flex-1 text-nowrap">
								{t("Login.orsigninwithemail")}
							</p>
							<div className="border w-full h-0" />
						</div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6 pb-3"
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
											<FormMessage />
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
							onClick={() => router.push("/signup")}
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
