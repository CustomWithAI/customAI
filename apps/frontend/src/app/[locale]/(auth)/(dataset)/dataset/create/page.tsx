"use client";
import { type FormFieldInput, useFormBuilder } from "@/components/builder/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { WorkflowTypeSection } from "@/features/workflow/components/workflow-type";
import {
	type DatasetDetailsSchema,
	datasetDetailsSchema,
} from "@/models/dataset";

const datasetDetailsFormField: FormFieldInput<DatasetDetailsSchema> = [
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
const CreateDatasetPage = () => {
	const onSubmitData = (data: DatasetDetailsSchema) => {
		console.log(data);
	};
	const { Provider, Build } = useFormBuilder({
		schema: datasetDetailsSchema,
		onSubmit: onSubmitData,
		formName: `create-dataset-${new Date().valueOf()}`,
	});

	return (
		<Provider>
			<Build formFields={datasetDetailsFormField} />
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button variant="ghost">Cancel</Button>
				<Button type="submit">Create</Button>
			</div>
		</Provider>
	);
};

export default CreateDatasetPage;
