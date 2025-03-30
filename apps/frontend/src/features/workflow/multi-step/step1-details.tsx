"use client";
import { type FormFieldInput, useFormBuilder } from "@/components/builder/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useCreateWorkflow } from "@/hooks/mutations/workflow-api";
import { useGetTrainingById } from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { toast, useToast } from "@/hooks/use-toast";
import { decodeBase64, encodeBase64 } from "@/libs/base64";
import { type WorkflowDetails, workflowDetails } from "@/models/workflow";
import { WorkflowTypeSection } from "../components/workflow-type";

const workflowDetailsFormField: FormFieldInput<WorkflowDetails> = [
	{
		template: "text",
		element: {
			label: "Workflow Name",
			key: "workflow-name",
			testDataId: "workflow-name",
			name: "name",
			placeholder: "Eg., 'Dog or Cat' or 'Flower varieties'",
		},
		config: {},
	},
	{
		template: "text",
		element: {
			label: "Workflow Description",
			key: "workflow-description",
			testDataId: "workflow-description",
			name: "description",
			placeholder: "Eg., ‘use for classified dog breed’",
		},
		config: {},
	},
	{
		template: "custom",
		element: {
			testDataId: "workflow-type",
			renderCustomInput({ control }) {
				return (
					<FormField
						control={control}
						name="type"
						render={({ field: { onChange, value } }) => (
							<WorkflowTypeSection value={value} onChange={onChange} />
						)}
					/>
				);
			},
		},
		config: {},
	},
];
export const Step1 = () => {
	const { mutateAsync: createWorkflow, isPending: createPending } =
		useCreateWorkflow();
	const { toast } = useToast();
	const { setQueryParam, getQueryParam } = useQueryParam();
	const [workflowId, trainingId] = getQueryParam(["id", "trainings"], ["", ""]);
	const { data: defaultValue } = useGetTrainingById(
		decodeBase64(workflowId),
		decodeBase64(trainingId),
		{ enabled: workflowId !== "" && trainingId !== "" },
	);
	const onSubmitData = async (data: WorkflowDetails) => {
		await createWorkflow(data, {
			onError: (e) => {
				toast({ title: e.message });
				return;
			},
			onSuccess: (t) => {
				if (!t) {
					toast({ title: "No data inside workflow" });
					return;
				}
				setQueryParam({
					params: {
						step: encodeBase64("preset"),
						id: encodeBase64(t?.data.id),
					},
					resetParams: true,
				});
			},
		});
	};
	const { Provider, Build } = useFormBuilder({
		schema: workflowDetails,
		onSubmit: onSubmitData,
		defaultValues: {
			name: defaultValue?.data.workflow.name,
			description: defaultValue?.data.workflow.description,
			type: defaultValue?.data.workflow.type,
		},
		formName: "create-Step1-id",
	});

	return (
		<Provider>
			<Build formFields={workflowDetailsFormField} />
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button disabled={createPending} variant="ghost">
					Cancel
				</Button>
				<Button disabled={createPending} type="submit">
					Next
				</Button>
			</div>
		</Provider>
	);
};
