import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type LoadingState = "idle" | "loading" | "success";
type ButtonType = "submit" | "reset" | "button" | undefined;

interface ButtonLoadingProps {
	name: string;
	loading: LoadingState;
	type?: ButtonType;
	className?: string;
}

export function ButtonLoading({
	name,
	loading,
	type = "button",
	className,
}: ButtonLoadingProps) {
	const t = useTranslations("Button");
	const commont = useTranslations();

	const getIcon = () => {
		switch (loading) {
			case "loading":
				return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
			case "success":
				return <Check className="mr-2 h-4 w-4" />;
			default:
				return null;
		}
	};

	const getText = () => {
		switch (loading) {
			case "loading":
				return t("please_wait");
			case "success":
				return t("submitted");
			default:
				return commont(name as any);
		}
	};

	return (
		<Button
			className={className}
			variant="secondary"
			type={type}
			disabled={loading !== "idle"}
		>
			{getIcon()}
			{getText()}
		</Button>
	);
}
