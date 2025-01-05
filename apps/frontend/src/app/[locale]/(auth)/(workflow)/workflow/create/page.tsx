"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { ViewList } from "@/components/specific/viewList";
import { Primary, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectiveBar } from "@/components/ui/selectiveBar";
import { ContentDataset } from "@/features/dataset/components/content";
import { useToast } from "@/hooks/use-toast";
import { type WorkflowDetails, workflowDetails } from "@/models/workflow";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter, PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";

export default function Page() {
	const t = useTranslations();
	const { toast } = useToast();
	const form = useForm<WorkflowDetails>({
		resolver: zodResolver(workflowDetails),
		mode: "onTouched",
	});

	async function onSubmit(data: WorkflowDetails) {}

	return (
		<AppNavbar activeTab="Home" disabledTab={undefined}>
			<Primary className="mb-4">Build a workflow</Primary>
			<SelectiveBar
				total={5}
				current={3}
				title="Select workflow type"
				icon={<PackageSearch />}
			/>
			<Subtle>Let's build your new model workflow</Subtle>
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
				</form>
			</Form>
		</AppNavbar>
	);
}
