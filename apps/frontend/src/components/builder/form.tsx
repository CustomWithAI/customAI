import { useToast } from "@/hooks/use-toast";
import { cn } from "@/libs/utils";
import {
	deleteSaveData,
	getSavedFormData,
	saveFormData,
} from "@/utils/local-save-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpFromLine } from "lucide-react";
import {
	type Key,
	type ReactElement,
	type ReactNode,
	useCallback,
	useEffect,
} from "react";
import { type ElementRef, useRef } from "react";
import {
	type Control,
	Controller,
	type DefaultValues,
	type FieldErrors,
	type FieldValues,
	FormProvider,
	type Path,
	type SubmitHandler,
	type UseFormGetValues,
	type UseFormSetValue,
	useForm,
	useFormContext,
	useWatch,
} from "react-hook-form";
import {
	type ZodDiscriminatedUnion,
	type ZodEffects,
	type ZodObject,
	type ZodRawShape,
	object,
	type z,
} from "zod";
import { BaseSkeleton } from "../specific/skeleton";
import { Content } from "../typography/text";
import { Button } from "../ui/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Selection } from "../ui/selection";
import { Switch } from "../ui/switch";

type SchemaType<T extends ZodRawShape | ZodDiscriminatedUnion<any, any>> =
	| ZodObject<T extends ZodRawShape ? T : never>
	| ZodEffects<ZodObject<T extends ZodRawShape ? T : never>>
	| ZodDiscriminatedUnion<any, any>;

type InferSchema<T extends ZodRawShape | ZodDiscriminatedUnion<any, any>> =
	z.infer<SchemaType<T>>;

type FormProviderProps<
	T extends ZodRawShape | ZodDiscriminatedUnion<any, any>,
> = {
	schema: SchemaType<T>;
	defaultValues?: DefaultValues<InferSchema<T>>;
	onSubmit: SubmitHandler<InferSchema<T>>;
	formName: string;
	children: ReactNode;
};

type TemplateType =
	| "text"
	| "number"
	| "percent"
	| "image"
	| "date"
	| "password";

type TemplateElement<T extends object> = {
	label: ReactNode;
	key: Key;
	description?: ReactNode;
	placeholder?: string;
	name: Path<T>;
	testDataId: string;
	valueType?: HTMLInputElement["type"];
	className?: string;
	required?: boolean;
};

type TemplateConfig = {
	enabled?: boolean;
	disabled?: boolean;
};

type TemplateConditional<T extends object> =
	| { conditionalField?: Path<T>; conditionalValue?: string | "none" }
	| {
			conditionalField?: Path<T>[];
			conditionalValue?: (string | "none")[];
	  };

type TemplatePriceOptions = {
	options?: {
		price?: string;
		color?: string;
	};
};

type TemplateSwitchOptions = {
	options?: {
		color?: string;
		box?: boolean;
	};
};

type UngroupedOptions = {
	options: {
		group?: false;
		list?: Array<{ value: string | boolean | number; label: string }>;
	};
};

type GroupedOptions = {
	options: {
		group: true;
		list?: Record<
			string,
			Array<{ value: string | boolean | number; label: string }>
		>;
	};
};

type TemplateGroupOptions = UngroupedOptions | GroupedOptions;

type TemplateForm<T extends object> =
	| {
			template: TemplateType;
			element: TemplateElement<T>;
			config: TemplateConfig &
				TemplateConditional<T> & { options?: Record<string, any> };
	  }
	| {
			template: "price";
			element: TemplateElement<T>;
			config: TemplateConfig & TemplatePriceOptions & TemplateConditional<T>;
	  }
	| {
			template: "switch";
			element: TemplateElement<T>;
			config: TemplateConfig & TemplateSwitchOptions & TemplateConditional<T>;
	  }
	| {
			template: "select";
			element: TemplateElement<T>;
			config: TemplateConfig & TemplateGroupOptions & TemplateConditional<T>;
	  };

type TemplateCustom<T extends object> = {
	template: "custom";
	element: {
		testDataId: string;
		renderCustomInput: (
			control: Control<T, unknown>,
			setValue: UseFormSetValue<T>,
			getValues: UseFormGetValues<T>,
			errors: FieldErrors<FieldValues>,
		) => ReactNode;
	};
	config: TemplateConditional<T> & TemplateConfig;
};

export type FormFields<T extends object> = TemplateForm<T> | TemplateCustom<T>;
export type FormFieldInput<T extends object> = FormFields<T>[];

type FormBuilderPropsType<
	T extends ZodRawShape | ZodDiscriminatedUnion<any, any>,
> = {
	schema:
		| ZodObject<T extends ZodRawShape ? T : never>
		| ZodEffects<ZodObject<T extends ZodRawShape ? T : never>>
		| ZodDiscriminatedUnion<any, any>;
	formFields: FormFields<
		z.infer<
			| ZodObject<T extends ZodRawShape ? T : never>
			| ZodDiscriminatedUnion<any, any>
		>
	>[];
	upper?: ReactNode;
	lower?: ReactNode;
	status?: boolean;
};

const FormBuilderProvider = <
	T extends ZodRawShape | ZodDiscriminatedUnion<any, any>,
>({
	formName,
	schema,
	defaultValues,
	onSubmit,
	children,
}: FormProviderProps<T>): ReactElement => {
	const getSavedData = useCallback(() => {
		return getSavedFormData(formName, defaultValues);
	}, [defaultValues, formName]);

	const methods = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: getSavedData(),
	});

	const watchedValues = useWatch({
		control: methods.control,
	});

	useEffect(() => {
		if (watchedValues) {
			saveFormData(formName, watchedValues);
		}
	}, [formName, watchedValues]);

	const handleSubmit = methods.handleSubmit(
		(data) => {
			deleteSaveData(formName);
			onSubmit(data);
		},
		(error) => console.log(error),
	);

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit}>{children}</form>
		</FormProvider>
	);
};

const Builder = <T extends ZodRawShape | ZodDiscriminatedUnion<any, any>>({
	status = false,
	formFields,
	upper,
	lower,
}: FormBuilderPropsType<T>) => {
	const {
		control,
		getValues,
		setValue,
		formState: { errors },
	} = useFormContext();

	const watchedValues = useWatch({ control });

	return (
		<>
			{upper || null}
			{formFields.map((field, fieldIndex) => {
				if (field.config) {
					const { conditionalField, conditionalValue, enabled } = field.config;
					const fieldsArray = Array.isArray(conditionalField)
						? conditionalField
						: [conditionalField];
					const valuesArray = Array.isArray(conditionalValue)
						? conditionalValue
						: [conditionalValue];
					const conditionsMet = fieldsArray.every((fieldPath, index) => {
						const watchValue = fieldPath
							? watchedValues[String(fieldPath)]
							: null;
						const expectedValue = valuesArray[index];
						if (expectedValue === "none") return true;
						return expectedValue ? watchValue === expectedValue : !!watchValue;
					});
					if (!conditionsMet || !enabled) {
						return null;
					}
				}
				if (field.template === "custom") {
					return field.element.renderCustomInput ? (
						<>
							{field.element.renderCustomInput(
								control,
								setValue,
								getValues,
								errors,
							)}
						</>
					) : null;
				}
				const { name } = field.element;
				return (
					<div className="my-6" key={name as string}>
						<BaseSkeleton template="line1" loading={status}>
							<RenderInput {...field} isFirstInput={fieldIndex === 0} />
							{errors?.[name] && (
								<p className="mt-1 text-xs font-semibold text-red-500">
									*{(errors[name] as any).message}
								</p>
							)}
						</BaseSkeleton>
					</div>
				);
			})}
			{lower || null}
		</>
	);
};

const RenderInput = <T extends object>({
	template,
	element: {
		label,
		key,
		description,
		placeholder,
		name,
		testDataId,
		valueType,
		className,
		required,
	},
	config: { enabled, disabled, options },
	isFirstInput,
}: TemplateForm<T> & {
	isFirstInput: boolean;
}) => {
	const hiddenFileInput = useRef<ElementRef<"input">>(null);
	const {
		control,
		formState: { errors },
	} = useFormContext<T>();
	const { toast } = useToast();
	const { mutateAsync: mutateUploadImage, isPending } = useUploadFile();
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (isFirstInput && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isFirstInput]);

	switch (template) {
		case "text":
		case "password": {
			return (
				<FormField
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						<FormItem className={cn(className)}>
							<FormLabel>{label}</FormLabel>
							{description && <FormDescription>{description}</FormDescription>}
							<FormControl>
								<Input
									aria-invalid={Boolean((errors as any)?.[String(name)])}
									required={required}
									data-cy={testDataId}
									disabled={disabled}
									autoFocus={isFirstInput}
									type={template}
									onChange={onChange}
									onBlur={onBlur}
									value={value ? String(value) : undefined}
									placeholder={placeholder}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			);
		}
		case "number": {
			return (
				<FormField
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						<FormItem className={cn(className)}>
							<FormLabel>{label}</FormLabel>
							{description && <FormDescription>{description}</FormDescription>}
							<FormControl>
								<Input
									aria-invalid={Boolean((errors as any)?.[String(name)])}
									required={required}
									data-cy={testDataId}
									disabled={disabled}
									autoFocus={isFirstInput}
									type="number"
									onChange={(e) => onChange(e.target.valueAsNumber)}
									onBlur={onBlur}
									value={!Number.isNaN(value) ? value : undefined}
									placeholder={placeholder}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			);
		}
		case "percent": {
			return (
				<FormField
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						<FormItem className={cn(className)}>
							<FormLabel>{label}</FormLabel>
							{description && <FormDescription>{description}</FormDescription>}
							<FormControl>
								<div className="relative w-full max-w-[200px]">
									<Input
										aria-invalid={Boolean((errors as any)?.[String(name)])}
										required={required}
										data-cy={testDataId}
										disabled={disabled}
										autoFocus={isFirstInput}
										type="number"
										onChange={(e) => onChange(e.target.valueAsNumber)}
										placeholder={placeholder}
										min={0}
										max={100}
										onBlur={onBlur}
										value={!Number.isNaN(value) ? value : undefined}
										className="pr-7"
									/>
									<span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
										%
									</span>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			);
		}
		case "switch": {
			return (
				<FormField
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						<FormItem
							className={cn(className, {
								"flex flex-row items-center justify-between rounded-lg border p-4":
									options && ("box" in options ? options?.box : false),
							})}
						>
							{description && label && (
								<div className="space-y-0.5">
									<FormLabel>{label}</FormLabel>
									{description && (
										<FormDescription>{description}</FormDescription>
									)}
								</div>
							)}
							<FormControl>
								<Switch
									checked={value}
									onCheckedChange={onChange}
									onBlur={onBlur}
									disabled={disabled}
									data-cy={testDataId}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			);
		}
		case "image":
			return (
				<FormField
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						<FormItem className={cn(className)}>
							<FormLabel>{label}</FormLabel>
							<FormDescription className="mb-3">
								Accept Image Link or JPEG, PNG, WEBP under 5MB
							</FormDescription>
							<div className="flex w-full">
								<Input
									aria-invalid={Boolean((errors as any)?.[String(name)])}
									value={typeof value === "string" ? value : undefined}
									type="text"
									onBlur={onBlur}
									disabled={disabled}
									className="w-full"
									data-cy={`${testDataId}-input`}
									placeholder="https://example.com/images"
									onChange={(e) => onChange(e.target.value)}
								/>
								<div className="my-auto h-full px-4">or</div>
								<Button
									disabled={isPending}
									variant="outline"
									onClick={() => hiddenFileInput.current?.click()}
								>
									<ArrowUpFromLine width={12} /> Upload
								</Button>
								<input
									ref={hiddenFileInput}
									type="file"
									hidden
									data-cy={`${testDataId}-upload`}
									accept="image/png, image/jpeg, image/webp"
									onChange={async (e) => {
										const file = e?.target?.files?.[0];
										if (!file) return;
										const response = await mutateUploadImage({
											file,
											progressCallbackFn: () => {},
											purpose: "product",
										});
										if (!response?.url) {
											return toast({
												title: "invalid upload image url",
												description: "",
												variant: "destructive",
											});
										}
										onChange(response?.url);
										return toast({ title: "successfully uploaded image" });
									}}
								/>
							</div>
						</FormItem>
					)}
				/>
			);
		case "price":
			return (
				<FormField
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						<FormItem className={cn(className)}>
							<FormLabel>{label}</FormLabel>
							<FormDescription className="mb-3">{description}</FormDescription>
							<div className="mt-3 inline-flex w-full gap-x-4">
								<Input
									aria-invalid={Boolean((errors as any)?.[String(name)])}
									type="number"
									data-cy={testDataId}
									disabled={disabled}
									pattern="^\\d+([.,]\\d+)?$"
									step={0.01}
									min={0}
									autoFocus={isFirstInput}
									placeholder={placeholder}
									onChange={(e) => onChange(e.target.valueAsNumber)}
									onBlur={onBlur}
									value={Number.isNaN(value) ? undefined : value}
								/>
								<Content className="my-auto">
									{(options as TemplatePriceOptions["options"])?.price || ""}
								</Content>
							</div>
						</FormItem>
					)}
				/>
			);
		case "select":
			return (
				<FormField
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						<FormItem className={cn(className)}>
							<FormLabel>{label}</FormLabel>
							<FormDescription className="mb-3">{description}</FormDescription>
							<Selection
								className="my-3"
								group={options && "group" in options ? options?.group : false}
								value={value}
								cyName={testDataId}
								disabled={disabled}
								placeholder={placeholder}
								onChange={onChange}
								options={options && "list" in options ? options?.list : {}}
							/>
						</FormItem>
					)}
				/>
			);
		case "date":
			return (
				<Field className={cn(className)}>
					<Label className="font-medium">{label}</Label>
					{description && <Description>{description}</Description>}
					<Controller
						name={name}
						control={control}
						render={({ field: { onChange, value } }) => (
							<DatePickerWithPresets
								onDateChange={onChange}
								data-cy={cyName}
								value={value}
							/>
						)}
					/>
				</Field>
			);
		default:
			return null;
	}
};

const FormBuilder = {
	Provider: FormBuilderProvider,
	Build: Builder,
};

export default FormBuilder;
