import { Header, Subtle } from "@/components/typography/text";
import { cn } from "../../../libs/utils";

interface CardProps {
	title: string;
	description: string;
	type?: string;
	typeClass?: string;
	onClick?: () => void;
	className?: string;
	images: string[];
}

export const ModelCard: React.FC<CardProps> = ({
	title,
	description,
	type,
	typeClass,
	onClick,
	className,
	images,
}) => {
	return (
		<button
			type="button"
			className={cn(
				"min-w-64 hover:shadow-blue-500 hover:shadow-sm duration-200 my-1 border",
				" rounded-lg shadow-md overflow-hidden [&>div]:flex-shrink-0",
				className,
			)}
			onClick={() => {
				onClick?.();
			}}
		>
			<div className="flex h-28 relative overflow-hidden">
				{images?.length === 0 ? (
					<div className="w-full h-28 rounded-md" />
				) : (
					images.map((image, index) => (
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
					))
				)}
				<div
					className={`${typeClass ?? "bg-white"} absolute top-2 right-2 text-xs px-2 py-1 rounded-md shadow`}
				>
					{type}
				</div>
			</div>
			<div className="w-full text-left p-6 pt-4 min-h-24 bg-white z-10">
				<Header className="font-semibold text-lg">{title}</Header>
				<Subtle className="text-sm text-gray-500">{description}</Subtle>
			</div>
		</button>
	);
};
