"use client";
import {
	Content,
	ContentHeader,
	Header,
	SubHeader,
} from "@/components/typography/text";
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
import { type AccountSchema, accountSchema } from "@/models/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eraser, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SecurityPage() {
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
				{t("Security.AccountSecurity")}
			</Header>
			<ContentHeader>change email and password</ContentHeader>
			<div>
				<Button variant="outline">change password</Button>
			</div>
			<div>
				<Button variant="outline">change email</Button>
			</div>
			<div>
				<Button variant="outline" className="text-red-500">
					revoke all session
				</Button>
			</div>
			<Header className="w-full border-b">
				{t("Security.TwoFactorAuthentication")}
			</Header>
			<Header className="w-full border-b">{t("Security.LinkAccounts")}</Header>
		</>
	);
}
