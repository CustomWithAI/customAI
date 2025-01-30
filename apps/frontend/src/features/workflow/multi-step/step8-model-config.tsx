"use client";
import { type FormFieldInput, useFormBuilder } from "@/components/builder/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useQueryParam } from "@/hooks/use-query-params";
import { encodeBase64 } from "@/libs/base64";
import {
	type ModelConfigurationSchema,
	modelConfigurationSchema,
} from "@/models/model-config";

const workflowDetailsFormField: FormFieldInput<ModelConfigurationSchema> = [
	{
		template: "text",
		element: {
			label: "Epochs",
			description: "Controls the number of training passes over the dataset",
			key: "epochs",
			testDataId: "epochs",
			name: "epochs",
			placeholder: "Eg., 1, 10, 100",
		},
		config: {},
	},
	{
		template: "text",
		element: {
			label: "Batch Size",
			description:
				"Higher values work well for balanced datasets and larger models",
			key: "batch_size",
			testDataId: "batch_size",
			name: "batch_size",
			placeholder: "Eg., 1, 10, 100",
		},
		config: {},
	},
	{
		template: "switch",
		element: {
			label: "Early Stopping",
			description: "Stops training if performance plateaus",
			key: "early-stopping",
			testDataId: "early-stopping",
			name: "early_stopping",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Early Stopping",
			description: "Stops training if performance plateaus",
			key: "early-stopping",
			testDataId: "early-stopping",
			name: "loss_function",
		},
		config: {
			options: {
				group: false,
			},
		},
	},
];
export const Step1 = () => {
	const { setQueryParam } = useQueryParam({ name: "step" });
	const onSubmitData = (data: ModelConfigurationSchema) => {
		setQueryParam({ value: encodeBase64("preset"), resetParams: true });
	};
	const { Provider, Build } = useFormBuilder({
		schema: modelConfigurationSchema,
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
