import { Header, Subtle } from "@/components/typography/text";
import { useRouter } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import { EllipsisVertical } from "lucide-react";

interface CardProps {
	title: string;
	description: string;
	imagesCount: number;
	className?: string;
	href: string;
	images: string[];
}

export const DatasetList: React.FC<CardProps> = ({
	title,
	description,
	imagesCount,
	className,
	href = "",
	images,
}) => {
	const router = useRouter();
	return (
		<button
			type="button"
			className={cn(
				"min-w-64 w-full grid grid-cols-3 hover:shadow-yellow-100 border-gray-200 hover:shadow-md duration-200 border rounded-lg shadow-xs overflow-hidden",
				className,
			)}
			onClick={() => router.push(href)}
		>
			<div className="text-left p-6 pt-4 min-h-24 bg-white z-10">
				<Header className="font-semibold text-lg">{title}</Header>
				<Subtle className="text-sm text-gray-500">{description}</Subtle>
			</div>
			<div className="flex h-28 p-6 pt-4">
				<div className=" bg-white text-sm px-2 py-1 rounded-md">
					{imagesCount} Images
				</div>
			</div>
			<div className="flex h-28 p-6 pt-4 justify-end">
				<EllipsisVertical />
			</div>
		</button>
	);
};
