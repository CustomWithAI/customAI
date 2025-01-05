import { ViewList } from "@/components/specific/viewList";
import { Subtle } from "@/components/typography/text";
import { cn } from "@/libs/utils";
import { DatasetCard } from "./gridBox";
import { DatasetList } from "./listBox";

export const ContentDataset = () => {
	const viewList = ViewList.useViewListState();
	const ContentCard = viewList === "Grid" ? DatasetCard : DatasetList;
	return (
		<div>
			<Subtle className="text-xs mb-3 font-medium">found of dataset</Subtle>
			<div className={cn({ "grid grid-cols-4": viewList === "Grid" })}>
				<ContentCard
					title="Cat and Dog"
					description="High-performance image classifier."
					imagesCount={14}
					href=""
					images={[
						"https://picsum.photos/200/300",
						"https://via.placeholder.com/150/f8d7da",
						"https://via.placeholder.com/150/ff6b6b",
					]}
				/>
			</div>
		</div>
	);
};
