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
import { type AccountSchema, accountSchema } from "@/models/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eraser, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AccountPage() {
	const [state, setState] = useState<boolean>(false);
	const [imageSrc, setImageSrc] = useState<string | null>(null);

	const handleEdit = () => {
		alert("Edit picture logic here");
	};

	const handleDelete = () => {
		setImageSrc(null);
	};

	const form = useForm<AccountSchema>({
		resolver: zodResolver(accountSchema),
		mode: "onTouched",
	});
	const t = useTranslations();
	const onSubmit = async (data: AccountSchema) => {};
	return (
		<>
			<Header className="w-full border-b">
				{t("Account.ProfileInformation")}
			</Header>
			<div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-y-4 gap-x-6 xl:gap-x-8">
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
				<div>
					<Content className="text-sm">{t("Account.ProfileImg")}</Content>
					<div className="relative max-w-64 max-h-64 aspect-square">
						<div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
							{imageSrc ? (
								<Image
									src={imageSrc}
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
							<button
								onClick={handleEdit}
								className="bg-white rounded-l-full shadow-md p-2 pl-4 pr-3 hover:bg-gray-100 border-r"
							>
								<Pencil className="w-4 h-4" strokeWidth="2.5" />
							</button>
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
