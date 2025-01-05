import { Button } from "@/components/catalyst/button";
import { Description, Field, Label } from "@/components/catalyst/fieldset";
import { Input, InputGroup } from "@/components/catalyst/input";
import { Switch, SwitchField } from "@/components/catalyst/switch";
import { Text } from "@/components/catalyst/text";
import { DatePickerWithPresets } from "@/components/date/presetpicker";
import { useUploadFile } from "@/hooks/upload-api";
import { cn } from "@/libs/utils";
import {
	ArrowUpTrayIcon,
	ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { type ElementRef, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Selection } from "../custom/selection";
import type { FormField } from "./form";

export const RenderInput = <T extends object>({
	required,
	cyName,
	name,
	label,
	description,
	inputType,
	className,
	disabled,
	placeholder,
	isFirstInput,
	renderCustomInput,
	options,
}: FormField<T> & {
	isFirstInput: boolean;
}) => {
	const hiddenFileInput = useRef<ElementRef<"input">>(null);
	const {
		control,
		formState: { errors },
	} = useFormContext<T>();
	const { mutateAsync: mutateUploadImage, isPending } = useUploadFile();
	switch (inputType) {
		case "text": {
			return (
				<Field className={cn(className)}>
					<Label className="font-medium">{label}</Label>
					{description && <Description>{description}</Description>}
					<Controller
						name={name}
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								invalid={Boolean((errors as any)?.[String(name)])}
								required={required}
								data-cy={cyName}
								disabled={disabled}
								autoFocus={isFirstInput}
								type="text"
								onChange={onChange}
								onBlur={onBlur}
								value={value ? String(value) : undefined}
								placeholder={placeholder}
							/>
						)}
					/>
				</Field>
			);
		}
		case "password": {
			return (
				<Field className={cn(className)}>
					<Label className="font-medium">{label}</Label>
					{description && <Description>{description}</Description>}
					<Controller
						name={name}
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								invalid={Boolean((errors as any)?.[String(name)])}
								required={required}
								data-cy={cyName}
								autoFocus={isFirstInput}
								disabled={disabled}
								type="password"
								onChange={onChange}
								onBlur={onBlur}
								value={value ? String(value) : undefined}
								placeholder={placeholder}
							/>
						)}
					/>
				</Field>
			);
		}
		case "number": {
			return (
				<Field className={cn(className)}>
					<Label className="font-medium">{label}</Label>
					{description && <Description>{description}</Description>}
					<Controller
						name={name}
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								invalid={Boolean((errors as any)?.[String(name)])}
								required={required}
								autoFocus={isFirstInput}
								data-cy={cyName}
								disabled={disabled}
								type="number"
								onChange={(e) => onChange(e.target.valueAsNumber)}
								onBlur={onBlur}
								value={!Number.isNaN(value) ? value : undefined}
								placeholder={placeholder}
							/>
						)}
					/>
				</Field>
			);
		}
		case "percent": {
			return (
				<Field className={cn(className)}>
					<Label className="font-medium">{label}</Label>
					{description && <Description>{description}</Description>}
					<div className="mt-3 flex">
						<InputGroup>
							<ReceiptPercentIcon className="max-sm:pb-1 sm:pt-1" />
							<Controller
								name={name}
								control={control}
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										invalid={Boolean((errors as any)?.[String(name)])}
										placeholder="0"
										required={required}
										data-cy={cyName}
										disabled={disabled}
										className="max-w-xs"
										type="number"
										autoFocus={isFirstInput}
										min={0}
										max={100}
										onChange={(e) => onChange(e.target.valueAsNumber)}
										onBlur={onBlur}
										value={!Number.isNaN(value) ? value : undefined}
									/>
								)}
							/>
						</InputGroup>
						<Text className="my-auto pl-3">%</Text>
					</div>
				</Field>
			);
		}
		case "switch": {
			return (
				<SwitchField className={cn(className)}>
					<Label className="font-medium">{label}</Label>
					<Controller
						name={name}
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Switch
								name="active"
								color="green"
								className="mt-0"
								onBlur={onBlur}
								disabled={disabled}
								data-cy={cyName}
								checked={value}
								defaultChecked={value}
								onChange={(e) => onChange(e)}
							/>
						)}
					/>
				</SwitchField>
			);
		}
		case "image": {
			return (
				<Field className={cn(className)}>
					<Label className="font-medium">{label}</Label>
					<Description className="mb-3">
						Accept Image Link or JPEG, PNG, WEBP under 5MB
					</Description>
					<Controller
						name={name}
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<div className="flex w-full">
								<Input
									invalid={Boolean((errors as any)?.[String(name)])}
									value={typeof value === "string" ? value : undefined}
									type="text"
									onBlur={onBlur}
									disabled={disabled}
									className="w-full"
									data-cy={`${cyName}-input`}
									placeholder="https://example.com/images"
									onChange={(e) => onChange(e.target.value)}
								/>
								<div className="my-auto h-full px-4">or</div>
								<Button
									disabled={isPending}
									outline
									onClick={() => hiddenFileInput.current?.click()}
								>
									<ArrowUpTrayIcon width={12} /> Upload
								</Button>
								<input
									ref={hiddenFileInput}
									type="file"
									hidden
									data-cy={`${cyName}_upload`}
									accept="image/png, image/jpeg, image/webp"
									onChange={async (e) => {
										const file = e?.target?.files?.[0];
										if (!file) return toast.error("wrong file format");
										const response = await mutateUploadImage({
											file,
											progressCallbackFn: () => {},
											purpose: "product",
										});
										if (!response?.url) {
											return toast.error("invalid upload image url");
										}
										onChange(response?.url);
										return toast.success("successfully uploaded image");
									}}
								/>
							</div>
						)}
					/>
				</Field>
			);
		}
		case "price": {
			return (
				<Field className={cn(className)}>
					<Label className="font-medium">{label}</Label>
					{description && <Description>{description}</Description>}
					<Controller
						name={name}
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<div className="mt-3 inline-flex w-full gap-x-4">
								<Input
									invalid={Boolean((errors as any)?.[String(name)])}
									type="number"
									data-cy={cyName}
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
								<Text className="my-auto">{options?.price || ""}</Text>
							</div>
						)}
					/>
				</Field>
			);
		}
		case "select": {
			return (
				<Controller
					name={name}
					control={control}
					render={({ field: { onChange, value } }) => (
						<Field className={cn(className)}>
							<Label className="font-medium">{label}</Label>
							<Selection
								className="my-3"
								group={options?.group || false}
								value={value}
								cyName={cyName}
								disabled={disabled}
								placeholder={placeholder}
								onChange={onChange}
								options={options?.list as any}
							/>
						</Field>
					)}
				/>
			);
		}
		case "date": {
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
		}
		default:
			return null;
	}
};
