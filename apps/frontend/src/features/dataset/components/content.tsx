import { InfiniteGrid } from "@/components/layout/infinityGrid";
import { WindowList } from "@/components/layout/windowList";
import { ViewList } from "@/components/specific/viewList";
import { Subtle } from "@/components/typography/text";
import { useGetInfDatasets } from "@/hooks/queries/dataset-api";
import { DatasetCard } from "./gridBox";
import { DatasetList } from "./listBox";

export const ContentDataset = ({
	total = 0,
	filters = {},
}: { total: number | undefined; filters?: Record<string, any> }) => {
	const viewList = ViewList.useViewListState();
	const ContentCard = viewList === "Grid" ? DatasetCard : DatasetList;
	const datasetQuery = useGetInfDatasets({
		params: {
			search: filters.name ? `name:${filters.name}` : null,
		},
	});
	console.log(filters);
	return (
		<div>
			<Subtle className="text-xs mb-3 font-medium">
				Found {total} {total > 1 ? "datasets" : "dataset"}
			</Subtle>
			{viewList === "Grid" ? (
				<InfiniteGrid
					query={datasetQuery}
					columns="auto"
					renderItem={(item, index) => (
						<ContentCard
							key={index}
							title={item.name}
							description={item.description}
							imagesCount={item.imageCount}
							href={`dataset/${item.id}`}
							images={item.images}
						/>
					)}
				/>
			) : (
				<WindowList
					query={datasetQuery}
					direction="vertical"
					className="space-y-3"
					itemContent={(index, item) => (
						<ContentCard
							key={index}
							title={item.name}
							description={item.description}
							imagesCount={item.imageCount}
							href={`dataset/${item.id}`}
							images={item.images}
						/>
					)}
				/>
			)}
		</div>
	);
};
