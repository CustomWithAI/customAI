import { Header } from "@/components/typography/text";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	VersionSection,
	type VersionSectionProps,
} from "@/features/workflow/components/version-section";

const versionList: VersionSectionProps[] = [
	{
		versionId: "1.1",
		versionName: "Starter Models",
		isDefault: true,
		time: new Date(),
		contributor: {
			imageSrc: "",
			name: "me",
		},
		changeInfo: [
			"model epoch from",
			{ value: "40", status: "default" },
			"to",
			{ value: "40", status: "changed" },
		],
	},
];

export const VersionPage = () => {
	const tags = [""];
	return (
		<>
			<Header>version</Header>
			<div className="grid md:grid-cols-4 max-md:grid-cols-1 max-lg:gap-6 lg:gap-8">
				<div className="col-span-1 md:col-span-3">
					<VersionSection {...versionList[0]} />
				</div>
				<div>
					<ScrollArea className="h-72 w-48 rounded-md border">
						<div className="p-4">
							<h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
							{tags.map((tag) => (
								<>
									<div key={tag} className="border-l text-sm">
										{tag}
									</div>
								</>
							))}
						</div>
					</ScrollArea>
				</div>
			</div>
		</>
	);
};
