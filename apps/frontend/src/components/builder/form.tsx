import { useUploadFile } from "@/hooks/mutations/uploadfile-api";
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
	memo,
	useCallback,
	useEffect,
} from "react";
import { type ElementRef, useRef } from "react";
import {
	type Control,
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
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export type SchemaType<
	T extends ZodRawShape | ZodDiscriminatedUnion<string, any>,
> =
	| ZodObject<T extends ZodRawShape ? T : never>
	| ZodEffects<ZodObject<T extends ZodRawShape ? T : never>>
	| ZodDiscriminatedUnion<string, any>;

type InferSchema<T extends ZodRawShape | ZodDiscriminatedUnion<string, any>> =
	z.infer<SchemaType<T>>;

type FormProviderProps<
	T extends ZodRawShape | ZodDiscriminatedUnion<string, any>,
> = {
	schema: SchemaType<T>;
	defaultValues?: DefaultValues<InferSchema<T>>;
	onSubmit?: SubmitHandler<InferSchema<T>>;
	formName: string;
	children: ReactNode;
};

type TemplateType =
	| "text"
	| "number"
	| "percent"
	| "slider"
	| "sliderInput"
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
	setValue?: unknown;
	setOnChange?: (value: unknown) => void;
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

type TemplateSliderOptions = {
	options?: {
		min: number;
		max: number;
		step: number;
	};
};

type UngroupedOptions = {
	options: {
		group: false;
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
			template: "slider";
			element: TemplateElement<T>;
			config: TemplateConfig & TemplateSliderOptions & TemplateConditional<T>;
	  }
	| {
			template: "sliderInput";
			element: TemplateElement<T>;
			config: TemplateConfig & TemplateSliderOptions & TemplateConditional<T>;
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
		renderCustomInput: (input: {
			control: Control<T, unknown>;
			setValue: UseFormSetValue<T>;
			getValues: UseFormGetValues<T>;
			errors: FieldErrors<FieldValues>;
		}) => ReactNode;
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
			onSubmit?.(data);
		},
		(error) => console.log(error),
	);

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit}>{children}</form>
		</FormProvider>
	);
};

const isEmptyObject = (obj: object): boolean => Object.keys(obj).length === 0;

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
				if (field.config.conditionalField || field.config.enabled) {
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
							{field.element.renderCustomInput({
								control,
								setValue,
								getValues,
								errors,
							})}
						</>
					) : null;
				}
				const { name, key } = field.element;
				return (
					<div
						className={cn(
							{ "my-6": fieldIndex !== 0 },
							{ "mb-6": fieldIndex === 0 },
						)}
						key={((name as string) + key) as string}
					>
						<BaseSkeleton template="line1" loading={status}>
							<RenderInput
								{...(field as TemplateForm<object>)}
								isFirstInput={fieldIndex === 0}
							/>
						</BaseSkeleton>
					</div>
				);
			})}
			{lower || null}
		</>
	);
};

const RenderInput = memo(
	<T extends object>({
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
		config: { enabled, disabled, options, setValue, setOnChange },
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
						key={key}
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormItem className={cn(className)}>
								<FormLabel>{label}</FormLabel>
								{description && (
									<FormDescription>{description}</FormDescription>
								)}
								<FormControl>
									<Input
										aria-invalid={Boolean((errors as any)?.[String(name)])}
										required={required}
										data-cy={testDataId}
										disabled={disabled}
										autoFocus={isFirstInput}
										type={template}
										onChange={setOnChange ? setOnChange : onChange}
										onBlur={onBlur}
										value={
											setValue
												? (setValue as string | number)
												: value
													? String(value)
													: undefined
										}
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
						key={key}
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormItem className={cn(className)}>
								<FormLabel>{label}</FormLabel>
								{description && (
									<FormDescription>{description}</FormDescription>
								)}
								<FormControl>
									<Input
										aria-invalid={Boolean((errors as any)?.[String(name)])}
										required={required}
										data-cy={testDataId}
										disabled={disabled}
										autoFocus={isFirstInput}
										type="tel"
										inputMode="decimal"
										pattern="[0-9]*[.,]?[0-9]*"
										onChange={(e) => {
											const inputValue = e.target.value.trim();
											const parsedValue =
												inputValue !== ""
													? Number.parseFloat(inputValue)
													: undefined;
											if (!Number.isNaN(parsedValue)) {
												setOnChange
													? setOnChange(parsedValue)
													: onChange(parsedValue);
											}
										}}
										onBlur={onBlur}
										value={
											setValue
												? !Number.isNaN(setValue)
													? (setValue as number)
													: undefined
												: !Number.isNaN(value)
													? value
													: undefined
										}
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
						key={key}
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormItem className={cn(className)}>
								<FormLabel>{label}</FormLabel>
								{description && (
									<FormDescription>{description}</FormDescription>
								)}
								<FormControl>
									<div className="relative w-full max-w-[200px]">
										<Input
											aria-invalid={Boolean((errors as any)?.[String(name)])}
											required={required}
											data-cy={testDataId}
											disabled={disabled}
											autoFocus={isFirstInput}
											type="number"
											onChange={(e) =>
												setOnChange
													? setOnChange(e.target.valueAsNumber)
													: onChange(e.target.valueAsNumber)
											}
											placeholder={placeholder}
											min={0}
											max={100}
											onBlur={onBlur}
											value={
												setValue
													? !Number.isNaN(setValue)
														? (setValue as number)
														: undefined
													: !Number.isNaN(value)
														? value
														: undefined
											}
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
						key={key}
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormItem
								className={cn(className, {
									"flex flex-row items-center justify-between rounded-lg border p-4":
										options && ("box" in options ? options?.box : false),
								})}
							>
								{label && (
									<div className="space-y-0.5">
										<FormLabel>{label}</FormLabel>
										{description && (
											<FormDescription>{description}</FormDescription>
										)}
									</div>
								)}
								<FormControl>
									<Switch
										defaultChecked={setValue as boolean}
										checked={
											setValue !== undefined || setValue !== null
												? (setValue as boolean)
												: value
										}
										onCheckedChange={setOnChange ? setOnChange : onChange}
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
			case "image": {
				return (
					<FormField
						key={key}
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
												datasetId: "",
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
			}
			case "price": {
				return (
					<FormField
						key={key}
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormItem className={cn(className)}>
								<FormLabel>{label}</FormLabel>
								<FormDescription className="mb-3">
									{description}
								</FormDescription>
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
										onChange={(e) =>
											setOnChange
												? setOnChange(e.target.valueAsNumber)
												: onChange(e.target.valueAsNumber)
										}
										onBlur={onBlur}
										value={
											setValue
												? !Number.isNaN(setValue)
													? (setValue as number)
													: undefined
												: !Number.isNaN(value)
													? value
													: undefined
										}
									/>
									<Content className="my-auto">
										{(options as TemplatePriceOptions["options"])?.price || ""}
									</Content>
								</div>
							</FormItem>
						)}
					/>
				);
			}
			case "select": {
				return (
					<FormField
						key={key}
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormItem className={cn(className)}>
								<FormLabel>{label}</FormLabel>
								<FormDescription className="mb-3">
									{description}
								</FormDescription>
								<Selection
									className="my-3"
									group={options && "group" in options ? options?.group : false}
									value={setValue as string | number | boolean}
									cyName={testDataId}
									disabled={disabled}
									placeholder={placeholder}
									onChange={setOnChange ? setOnChange : onChange}
									options={options && "list" in options ? options?.list : {}}
								/>
							</FormItem>
						)}
					/>
				);
			}
			case "slider": {
				return (
					<FormField
						key={key}
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormItem className={cn(className)}>
								<div className="flex items-center justify-between">
									<>
										<FormLabel>{label}</FormLabel>
										<FormDescription className="mb-3">
											{description}
										</FormDescription>
									</>
									<span className="text-sm text-muted-foreground w-12 text-right">
										{setValue ? (setValue as number) : value || 0}
									</span>
								</div>
								<Slider
									max={options && "max" in options ? options?.max : 100}
									min={options && "min" in options ? options?.min : 0}
									step={options && "step" in options ? options?.step : 1}
									value={setValue ? [setValue as number] : [value || 0]}
									data-cyName={testDataId}
									disabled={disabled}
									onValueChange={(v) =>
										setOnChange ? setOnChange(v[0]) : onChange(v[0])
									}
									id="slider"
									className="cursor-pointer"
									aria-label="Percentage value"
								/>
							</FormItem>
						)}
					/>
				);
			}
			case "sliderInput": {
				return (
					<FormField
						key={key}
						control={control}
						name={name}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormItem className={cn(className)}>
								<div className="flex items-center">
									<FormLabel>{label}</FormLabel>
									<FormDescription className="mb-3">
										{description}
									</FormDescription>
								</div>
								<div className="flex items-center gap-x-3 justify-between">
									<Slider
										max={options && "max" in options ? options?.max : 100}
										min={options && "min" in options ? options?.min : 0}
										step={options && "step" in options ? options?.step : 1}
										value={setValue ? [setValue as number] : [value || 0]}
										data-cyName={testDataId}
										disabled={disabled}
										onValueChange={(v) =>
											setOnChange ? setOnChange(v[0]) : onChange(v[0])
										}
										id="slider"
										className="cursor-pointer"
										aria-label="Percentage value"
									/>
									<Input
										className="w-16"
										aria-invalid={Boolean((errors as any)?.[String(name)])}
										required={required}
										max={options && "max" in options ? options?.max : 100}
										min={options && "min" in options ? options?.min : 0}
										data-cy={testDataId}
										inputMode="decimal"
										pattern="[0-9]*[.,]?[0-9]*"
										disabled={disabled}
										autoFocus={isFirstInput}
										type="tel"
										onChange={(e) => {
											const inputValue = e.target.value.trim();
											const parsedValue =
												inputValue !== ""
													? Number.parseFloat(inputValue)
													: Number.NaN;
											if (!Number.isNaN(parsedValue)) {
												setOnChange
													? setOnChange(parsedValue)
													: onChange(parsedValue);
											}
										}}
										onBlur={onBlur}
										defaultValue={value || 0}
										value={
											setValue
												? !Number.isNaN(setValue)
													? (setValue as number)
													: undefined
												: !Number.isNaN(value)
													? value
													: undefined
										}
										placeholder={placeholder}
									/>
								</div>
							</FormItem>
						)}
					/>
				);
			}
			case "date":
				return <></>;
			default:
				console.warn("not implemented function");
				return null;
		}
	},
);

const FormBuilder = {
	Provider: FormBuilderProvider,
	Build: Builder,
};

const useFormBuilder = <
	T extends ZodRawShape | ZodDiscriminatedUnion<string, any>,
>({
	schema,
	defaultValues,
	onSubmit,
	formName,
}: Omit<FormProviderProps<T>, "children">) => {
	const Provider = ({ children }: { children: React.ReactNode }) => (
		<FormBuilderProvider
			formName={formName}
			schema={schema}
			defaultValues={defaultValues}
			onSubmit={onSubmit}
		>
			{children}
		</FormBuilderProvider>
	);

	const Build = (
		props: Omit<React.ComponentProps<typeof FormBuilder.Build>, "schema">,
	) => <Builder schema={schema} {...props} />;

	return { Provider, Build };
};

export { FormBuilder, useFormBuilder };
