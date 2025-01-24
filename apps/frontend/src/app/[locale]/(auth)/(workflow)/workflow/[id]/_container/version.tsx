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
	{
		versionId: "1.2",
		versionName: "fixed Models",
		isDefault: false,
		time: new Date(),
		contributor: {
			imageSrc: "",
			name: "me",
		},
		changeInfo: [
			"model epoch from",
			{ value: "50", status: "default" },
			"to",
			{ value: "120", status: "changed" },
		],
	},
];

export const VersionPage = () => {
	return (
		<>
			<Header>Versions list</Header>
			<div className="grid md:grid-cols-4 max-md:grid-cols-1 max-lg:gap-6 lg:gap-8">
				<div className="col-span-1 md:col-span-3 space-y-5">
					{versionList.map((version) => (
						<VersionSection key={version.versionId} {...version} />
					))}
				</div>
				<div>
					<ScrollArea className="h-72 w-48 rounded-md border">
						<div className="p-4">
							<h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
							{versionList.map((tag) => (
								<>
									<div
										key={tag.versionId}
										className="border-l pl-3 py-1 text-sm hover:bg-zinc-100 duration-200"
									>
										{tag.versionId}
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
