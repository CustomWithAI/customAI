import { InfiniteTable } from "@/components/layout/InfinityTable";
import { InfiniteGrid } from "@/components/layout/infinityGrid";
import { WindowList } from "@/components/layout/windowList";
import { ViewList } from "@/components/specific/viewList";
import { Subtle } from "@/components/typography/text";
import { useGetInfDatasets } from "@/hooks/queries/dataset-api";
import { useFormatter } from "next-intl";
import { DatasetCard } from "./gridBox";
import { DatasetList } from "./listBox";

export const ContentDataset = ({
	total = 0,
	filters = {},
}: { total: number | undefined; filters?: Record<string, any> }) => {
	const viewList = ViewList.useViewListState();
	const { relativeTime } = useFormatter();
	const ContentCard = viewList === "Grid" ? DatasetCard : DatasetList;
	const datasetQuery = useGetInfDatasets({
		params: {
			search: filters.name ? `name:${filters.name}` : null,
		},
	});
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
				<InfiniteTable
					className="-mt-12"
					query={datasetQuery}
					keyField="id"
					bordered={true}
					striped={true}
					clickableRows={true}
					columns={[
						{
							header: "Name",
							accessorKey: "name",
							type: "bold",
							href: (item) => `/dataset/${item.id}`,
						},
						{
							header: "Description",
							accessorKey: "description",
						},
						{
							header: "Image",
							accessorKey: "imageCount",
							cell(item) {
								return `${item.imageCount} image${item.imageCount ? "s" : ""}`;
							},
						},
						{
							header: "Created At",
							accessorKey: "createdAt",
							type: "muted",
							cell: (item) => relativeTime(new Date(item.createdAt)),
						},
					]}
					onRowClick={(user) => console.log("Row clicked:", user)}
				/>
			)}
		</div>
	);
};
