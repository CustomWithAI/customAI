"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWorkflow } from "@/hooks/mutations/workflow-api";
import { useGetEnum } from "@/hooks/queries/enum-api";
import { useToast } from "@/hooks/use-toast";
import type { WorkflowDetails } from "@/models/workflow";
import { toCapital } from "@/utils/toCapital";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface WorkflowEditFormProps {
	workflow: WorkflowDetails | undefined;
	id: string;
}

export function WorkflowEditForm({ workflow, id }: WorkflowEditFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const { mutateAsync: updateWorkflow } = useUpdateWorkflow();
	const { data: enumType } = useGetEnum();

	async function handleSubmit(formData: FormData) {
		setIsSubmitting(true);
		await updateWorkflow(
			{
				id,
				workflow: {
					name: formData.get("name")?.toString(),
					description: formData.get("description")?.toString(),
					type: formData.get("type")?.toString(),
				},
			},
			{
				onSuccess: (data) => {
					toast({
						title: "Success",
						description: "Workflow updated successfully",
					});
					queryClient.invalidateQueries({
						queryKey: ["workflows", data?.data.id],
					});
					setIsSubmitting(false);
				},
				onError: (e) => {
					toast({
						title: "Error",
						description: e.message,
						variant: "destructive",
					});
					setIsSubmitting(false);
				},
			},
		);
	}

	return (
		<form action={handleSubmit} className="space-y-4">
			<div className="grid gap-2">
				<Label htmlFor="name">Name</Label>
				<Input id="name" name="name" defaultValue={workflow?.name} required />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					defaultValue={workflow?.description || ""}
					rows={3}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="type">Type</Label>
				<select
					id="type"
					name="type"
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					defaultValue={workflow?.type}
					required
				>
					{((enumType?.data?.annotationMethod as string[]) || []).map((e) => (
						<option key={e} value={e}>
							{toCapital(e)}
						</option>
					))}
				</select>
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
