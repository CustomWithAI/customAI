"use client";
import { Content, Header } from "@/components/typography/text";
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
import UploadFile from "@/components/ui/uploadfile";
import { toast } from "@/hooks/use-toast";
import { authClient, useSession } from "@/libs/auth-client";
import { type AccountSchema, accountSchema } from "@/models/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eraser, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function AccountPage() {
	const [state, setState] = useState<boolean>(false);
	const [imageSrc, setImageSrc] = useState<File | null>(null);

	const { data: session } = useSession();

	useEffect(() => {
		if (session?.user?.image)
			setImageSrc(base64ToFile(session?.user?.image, "user"));
		if (session?.user?.name) form.setValue("username", session?.user?.name);
	}, [session]);

	const handleDelete = () => {
		setImageSrc(null);
		authClient.updateUser({
			image: undefined,
		});
	};

	const form = useForm<AccountSchema>({
		resolver: zodResolver(accountSchema),
		mode: "onTouched",
		defaultValues: {
			username: session?.user?.name,
		},
	});

	const t = useTranslations();
	const onSubmit = async (data: AccountSchema) => {
		await authClient.updateUser(
			{
				name: data.username,
			},
			{
				onSuccess: () => {
					toast({ title: "update user successfully " });
				},
			},
		);
	};
	return (
		<>
			<Header className="w-full border-b border-gray-200 mb-1">
				{t("Account.ProfileInformation")}
			</Header>
			<div className="md:w-11/12 grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-y-4 gap-x-6 xl:gap-x-8">
				<div className="lg:col-span-3">
					<div className="max-w-md">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4 pb-3 text-left"
							>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("Account.Name")}</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="jane doe"
													id="username"
													type="text"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div>
									<ButtonLoading
										name="Account.Update"
										loading="idle"
										type="submit"
									/>
								</div>
							</form>
						</Form>
					</div>
				</div>
				<div className="md:mt-3">
					<Content className="text-sm">{t("Account.ProfileImg")}</Content>
					<div className="relative max-w-64 max-h-64 aspect-square">
						<div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
							{imageSrc ? (
								<Image
									src={URL.createObjectURL(imageSrc)}
									alt="Profile Picture"
									width={128}
									height={128}
									className="object-cover"
								/>
							) : (
								<span className="text-gray-500">{t("Account.ProfileImg")}</span>
							)}
						</div>
						<div className="absolute bottom-2 right-2 flex">
							<UploadFile.dialog
								button=<button className="bg-white rounded-l-full shadow-md p-2 pl-4 pr-3 hover:bg-gray-100 border-r border-gray-200">
									<Pencil className="w-4 h-4" strokeWidth="2.5" />
								</button>
								dialog={{
									title: "Upload Images",
									description: "",
								}}
								noApi
								onFileChange={async (file) => {
									setImageSrc(file as File);
									await authClient.updateUser({
										image: await convertImageToBase64(file as File),
									});
								}}
							/>

							<button
								onClick={handleDelete}
								className="bg-white rounded-r-full shadow-md p-2 pl-3 pr-4 hover:bg-gray-100 text-red-500"
							>
								<Eraser className="w-4 h-4" strokeWidth="2.5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export function base64ToFile(base64: string, filename: string): File {
	const [header, data] = base64.split(",");
	const mimeMatch = header.match(/data:(.*);base64/);

	if (!mimeMatch) throw new Error("Invalid base64 format");

	const mime = mimeMatch[1];
	const binary = atob(data);
	const array = new Uint8Array(binary.length);

	for (let i = 0; i < binary.length; i++) {
		array[i] = binary.charCodeAt(i);
	}

	return new File([array], filename, { type: mime });
}
