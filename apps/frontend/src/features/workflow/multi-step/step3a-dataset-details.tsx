"use client";
import { type FormFieldInput, useFormBuilder } from "@/components/builder/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useQueryParam } from "@/hooks/use-query-params";
import { encodeBase64 } from "@/libs/base64";
import {
	type DatasetDetailsSchema,
	datasetDetailsSchema,
} from "@/models/dataset";
import { type WorkflowDetails, workflowDetails } from "@/models/workflow";
import { WorkflowTypeSection } from "../components/workflow-type";

const workflowDetailsFormField: FormFieldInput<DatasetDetailsSchema> = [
	{
		template: "text",
		element: {
			label: "Dataset Name",
			key: "dataset-name",
			testDataId: "dataset-name",
			name: "name",
			placeholder: "Eg., 'Dog or Cat' or 'Flower varieties'",
		},
		config: {},
	},
	{
		template: "text",
		element: {
			label: "Dataset Description",
			key: "dataset-description",
			testDataId: "dataset-description",
			name: "description",
			placeholder: "Eg., ‘use for classified dog breed’",
		},
		config: {},
	},
	{
		template: "custom",
		element: {
			testDataId: "dataset-type",
			renderCustomInput({ control }) {
				return (
					<FormField
						control={control}
						name="pipeline_type"
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
export const DatasetDetails = () => {
	const { setQueryParam } = useQueryParam({ name: "step" });
	const onSubmitData = (data: WorkflowDetails) => {
		setQueryParam({ value: encodeBase64("preset"), resetParams: true });
	};
	const { Provider, Build } = useFormBuilder({
		schema: datasetDetailsSchema,
		onSubmit: onSubmitData,
		formName: "create-Step1-id",
	});

	return (
		<Provider>
			<Build formFields={workflowDetailsFormField} />
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button variant="ghost">Cancel</Button>
				<Button type="submit">Next</Button>
			</div>
		</Provider>
	);
};
