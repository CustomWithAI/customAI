import { Header } from "@/components/typography/text";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { WorkflowEditForm } from "@/features/workflow/components/editForm";
import { WorkflowSettingForm } from "@/features/workflow/components/settingForm";
import type { WorkflowDetails } from "@/models/workflow";
import { Suspense } from "react";

export const SettingPage = ({
	id,
	workflows,
}: { id: string; workflows: WorkflowDetails | undefined }) => {
	return (
		<>
			<Header>General Settings</Header>
			<Card>
				<CardHeader>
					<CardTitle>Workflows</CardTitle>
					<CardDescription>View and manage your AI workflows</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<div>Loading workflows...</div>}>
						<WorkflowEditForm id={id} workflow={workflows} />
					</Suspense>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>Workflow Operation</CardHeader>
				<CardContent>
					<Suspense fallback={<div>Loading workflows...</div>}>
						<WorkflowSettingForm id={id} workflow={workflows} />
					</Suspense>
				</CardContent>
			</Card>
		</>
	);
};
