import { ViewList } from "@/components/specific/viewList";
import { Subtle } from "@/components/typography/text";
import { cn } from "@/libs/utils";
import { DatasetCard } from "./gridBox";
import { DatasetList } from "./listBox";

export const ContentDataset = () => {
	const viewList = ViewList.useViewListState();
	const ContentCard = viewList === "Grid" ? DatasetCard : DatasetList;
	const datasets = [
		{
			title: "Cat and Dog",
			description: "High-performance image classifier.",
			imagesCount: 14,
			href: "",
			images: [
				"https://picsum.photos/200/300",
				"https://via.placeholder.com/150/f8d7da",
				"https://via.placeholder.com/150/ff6b6b",
			],
		},
		{
			title: "Wildlife",
			description: "Dataset featuring wildlife animals.",
			imagesCount: 20,
			href: "",
			images: [
				"https://via.placeholder.com/150/6bc6ff",
				"https://via.placeholder.com/150/009688",
				"https://via.placeholder.com/150/ff5722",
			],
		},
		{
			title: "Urban Scenes",
			description: "A collection of urban scene images.",
			imagesCount: 30,
			href: "",
			images: [
				"https://via.placeholder.com/150/ffc107",
				"https://via.placeholder.com/150/03a9f4",
				"https://via.placeholder.com/150/e91e63",
			],
		},
	];

	return (
		<div>
			<Subtle className="text-xs mb-3 font-medium">
				Found {datasets.length} {datasets.length > 1 ? "datasets" : "dataset"}
			</Subtle>
			<div className={cn({ "grid grid-cols-4 gap-4": viewList === "Grid" })}>
				{datasets.map((dataset, index) => (
					<ContentCard
						key={index}
						title={dataset.title}
						description={dataset.description}
						imagesCount={dataset.imagesCount}
						href={dataset.href}
						images={dataset.images}
					/>
				))}
			</div>
		</div>
	);
};
