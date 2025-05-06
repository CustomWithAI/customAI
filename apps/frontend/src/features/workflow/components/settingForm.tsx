"use client";

import { DialogBuilder } from "@/components/builder/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	useDeleteWorkflow,
	useUpdateWorkflow,
} from "@/hooks/mutations/workflow-api";
import { useGetEnum } from "@/hooks/queries/enum-api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/libs/i18nNavigation";
import type { WorkflowDetails } from "@/models/workflow";
import { toCapital } from "@/utils/toCapital";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface WorkflowEditFormProps {
	workflow: WorkflowDetails | undefined;
	id: string;
}

export function WorkflowSettingForm({ workflow, id }: WorkflowEditFormProps) {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const router = useRouter();
	const { mutateAsync: deleteWorkflow } = useDeleteWorkflow();
	const { data: enumType } = useGetEnum();

	return (
		<>
			<div className="grid gap-2">
				<Label htmlFor="name">Delete workflow</Label>
				<div>
					<DialogBuilder
						config={{
							trigger: (
								<Button
									variant="outline"
									className="text-red-500 border-red-500 hover:text-red-800"
								>
									delete workflow
								</Button>
							),
							title: "are you want to delete this dataset",
							description: "remove those image and dataset permanently",
							onConfirm: () =>
								deleteWorkflow(
									{ id: id || "" },
									{
										onSuccess: () => {
											toast({ title: "delete dataset successfully" });
											router.push("/workflow");
										},
									},
								),
						}}
					/>
				</div>
			</div>
		</>
	);
}
