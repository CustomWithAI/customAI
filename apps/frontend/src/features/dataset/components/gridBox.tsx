import { Header, Subtle } from "@/components/typography/text";
import { useRouter } from "@/libs/i18nNavigation";

interface CardProps {
	title: string;
	description: string;
	imagesCount: number;
	href: string;
	images: string[];
}

export const DatasetCard: React.FC<CardProps> = ({
	title,
	description,
	imagesCount,
	href = "",
	images,
}) => {
	const router = useRouter();
	return (
		<button
			type="button"
			className="min-w-64 hover:shadow-yellow-500 hover:shadow-sm duration-200 border rounded-lg shadow-md overflow-hidden"
			onClick={() => router.push(href)}
		>
			<div className="flex h-36 relative overflow-hidden">
				{images.map((image, index) => (
					<div className="w-full" key={`dataset-${title + String(index)}`}>
						<div
							className="flex-1 h-36 shadow-md"
							style={{
								backgroundImage: `url(${image})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								zIndex: index,
							}}
						/>
					</div>
				))}
				<div className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-md shadow">
					{imagesCount} Images
				</div>
			</div>
			<div className="w-full text-left p-6 pt-4 min-h-24 bg-white z-10">
				<Header className="font-semibold text-lg">{title}</Header>
				<Subtle className="text-sm text-gray-500">{description}</Subtle>
			</div>
		</button>
	);
};
