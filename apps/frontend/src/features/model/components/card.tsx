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
				"size-52 md:size-64 border-gray-200 hover:shadow-blue-500 aspect-square hover:shadow-xs duration-200 my-1 border",
				" rounded-lg shadow-md overflow-hidden [&>div]:shrink-0 p-4",
				className,
			)}
			onClick={() => {
				onClick?.();
			}}
		>
			<div className="flex h-28 relative overflow-hidden">
				{images?.length === 0 ? (
					<div
						className={cn(
							"flex flex-1 w-full h-28 min-h-[6rem] rounded-xl [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black",
							"[background-size:20px_20px]",
							"[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
							"dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
						)}
					/>
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
					className={`${typeClass ?? "bg-white"} absolute top-2 right-2 text-xs px-2 py-1 rounded-md shadow-sm`}
				>
					{type}
				</div>
			</div>
			<div className="w-full text-left pt-4 min-h-24 bg-white z-10">
				<Header className="font-semibold capitalize text-lg">
					{title.split("_").join(" ")}
				</Header>
				<Subtle className="text-sm text-gray-500 text-wrap">
					{description}
				</Subtle>
			</div>
		</button>
	);
};
