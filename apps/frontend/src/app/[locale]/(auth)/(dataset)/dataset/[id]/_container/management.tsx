import { Header, SubHeader, Subtle } from "@/components/typography/text";
import { Settings2 } from "lucide-react";

export default function DatasetManagement() {
	return (
		<>
			<Header className=" inline-flex items-center gap-x-2">
				<Settings2 /> Dataset Management
			</Header>
			<div className="space-y-6">
				<div className="border-b w-full pb-2">
					<SubHeader className="font-medium leading-8">
						Train/Test Split
					</SubHeader>
					<Subtle>Rebalance test/train split image dataset</Subtle>
				</div>
				<div className="border-b w-full pb-2">
					<SubHeader className="font-medium leading-8">Annotation</SubHeader>
					<Subtle>Tagging images to prepare them for model training</Subtle>
				</div>
			</div>
		</>
	);
}
