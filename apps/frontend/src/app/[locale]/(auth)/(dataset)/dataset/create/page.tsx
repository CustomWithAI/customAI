"use client";
import { type FormFieldInput, useFormBuilder } from "@/components/builder/form";
import { AppNavbar } from "@/components/layout/appNavbar";
import { FlowNavigator } from "@/components/specific/flowNavigation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { WorkflowTypeSection } from "@/features/workflow/components/workflow-type";
import { useCreateDataset } from "@/hooks/mutations/dataset-api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/libs/i18nNavigation";
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
						name="annotationMethod"
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
	const { mutateAsync: createDataset } = useCreateDataset();
	const router = useRouter();
	const { toast } = useToast();

	const onSubmitData = async (data: DatasetDetailsSchema) => {
		await createDataset(
			{ data },
			{
				onSuccess: (ctx) => {
					toast({ title: `create dataset ${ctx?.data.name} successfully` });
					router.push(`${ctx?.data.id}`);
				},
			},
		);
	};
	const { Provider, Build } = useFormBuilder({
		schema: datasetDetailsSchema,
		onSubmit: onSubmitData,
		formName: `create-dataset-${new Date().valueOf()}`,
	});

	return (
		<AppNavbar activeTab="Home" PageTitle="home" disabledTab={undefined}>
			<FlowNavigator title="Create Basic Info - 1" />
			<Provider>
				<Build formFields={datasetDetailsFormField} />
				<div className="flex justify-end w-full space-x-4 mt-6">
					<Button variant="ghost">Cancel</Button>
					<Button type="submit">Create</Button>
				</div>
			</Provider>
		</AppNavbar>
	);
};

export default CreateDatasetPage;
