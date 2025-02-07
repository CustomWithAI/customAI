import { Header, Subtle } from "@/components/typography/text";
import { useRouter } from "@/libs/i18nNavigation";
import { EllipsisVertical } from "lucide-react";

interface CardProps {
	title: string;
	description: string;
	imagesCount: number;
	href: string;
	images: string[];
}

export const DatasetList: React.FC<CardProps> = ({
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
			className="min-w-64 grid grid-cols-3 hover:shadow-yellow-100 hover:shadow-md duration-200 border rounded-lg shadow-sm overflow-hidden"
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
