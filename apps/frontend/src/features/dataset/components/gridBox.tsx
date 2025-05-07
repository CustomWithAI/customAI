import { Header, Subtle } from "@/components/typography/text";
import { useRouter } from "@/libs/i18nNavigation";
import { MessageCircleWarning } from "lucide-react";
import { cn } from "../../../libs/utils";

interface CardProps {
	title: string;
	description: string;
	imagesCount: number;
	href?: string;
	selectMode?: boolean;
	onClick?: () => void;
	splitMethod?: string;
	className?: string;
	images: string[];
}

export const DatasetCard: React.FC<CardProps> = ({
	title,
	description,
	imagesCount,
	href = "",
	splitMethod,
	selectMode = false,
	onClick,
	className,
	images,
}) => {
	const router = useRouter();
	return (
		<button
			type="button"
			className={cn(
				"flex flex-col min-w-64 h-60 hover:shadow-blue-500 hover:shadow-xs duration-200 border border-gray-200",
				" rounded-lg shadow-md overflow-hidden aspect-[4/3]",
				className,
			)}
			onClick={() => {
				href && router.push(href);
				onClick?.();
			}}
		>
			<div className="flex h-28 relative overflow-hidden">
				{images.slice(0, 5).map((image, index) => (
					<div className="w-full" key={`dataset-${title + String(index)}`}>
						<div
							className="flex-1 h-28 shadow-md"
							style={{
								backgroundImage: `url(${image})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								zIndex: index,
							}}
						/>
					</div>
				))}
				<div className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-md shadow-sm">
					{imagesCount} Images
				</div>
			</div>
			<div className="w-full text-left p-6 pt-4 min-h-24 bg-white z-10">
				<Header className="font-semibold text-lg truncate">{title}</Header>
				<Subtle
					className={cn("text-sm flex text-gray-500 truncate", {
						"text-red-500": selectMode && (!splitMethod || imagesCount < 10),
					})}
				>
					{selectMode && (!splitMethod || imagesCount < 10) && (
						<MessageCircleWarning className="size-4 mt-0.5 mr-1" />
					)}
					{!selectMode
						? description
						: !splitMethod
							? "no split method in dataset"
							: imagesCount < 10
								? "dataset contains fewer than 10 images."
								: description}
				</Subtle>
			</div>
		</button>
	);
};
