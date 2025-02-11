import { ViewList } from "@/components/specific/viewList";
import { Subtle } from "@/components/typography/text";
import { cn } from "@/libs/utils";
import type { ResponseDataset } from "@/types/response/dataset";
import { DatasetCard } from "./gridBox";
import { DatasetList } from "./listBox";

export const ContentDataset = ({
	datasets,
	total = 0,
}: { datasets: ResponseDataset[] | undefined; total: number | undefined }) => {
	const viewList = ViewList.useViewListState();
	const ContentCard = viewList === "Grid" ? DatasetCard : DatasetList;
	if (!datasets) {
		return <></>;
	}
	return (
		<div>
			<Subtle className="text-xs mb-3 font-medium">
				Found {total} {total > 1 ? "datasets" : "dataset"}
			</Subtle>
			<div
				className={cn(
					{ "grid grid-cols-4 gap-4": viewList === "Grid" },
					{ "flex flex-col gap-y-4": viewList === "Vertical" },
				)}
			>
				{datasets.map((dataset, index) => (
					<ContentCard
						key={index}
						title={dataset.name}
						description={dataset.description}
						imagesCount={dataset.imageCount}
						href={`dataset/${dataset.id}`}
						images={dataset.images}
					/>
				))}
			</div>
		</div>
	);
};
