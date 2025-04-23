import { WindowList } from "@/components/layout/windowList";
import { Header } from "@/components/typography/text";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VersionSection } from "@/features/workflow/components/version-section";
import { useGetInfTrainingByWorkflowId } from "@/hooks/queries/training-api";
import { cn } from "@/libs/utils";
import { findPreviousVersion } from "@/utils/lastVersion";
import { useMemo, useState } from "react";

export const VersionPage = ({ id }: { id: string }) => {
	const versionData = useGetInfTrainingByWorkflowId(id);
	const [activeVersion, setActiveVersion] = useState<string | null>(null);
	const items = useMemo(
		() =>
			versionData?.data?.pages
				?.flatMap((page) => page?.data)
				.filter((i) => i !== undefined) || [],
		[versionData.data],
	);

	return (
		<>
			<Header>Versions list</Header>
			<div className="grid md:grid-cols-4 max-md:grid-cols-1 max-lg:gap-6 lg:gap-8">
				<div className="md:col-span-3">
					<WindowList
						query={versionData}
						direction="vertical"
						noNavigation
						itemContent={(index, item, list) => {
							const prevVersion = findPreviousVersion(list, item.version);
							return (
								<VersionSection
									key={item.version}
									current={item}
									prev={prevVersion}
									onInView={setActiveVersion}
								/>
							);
						}}
					/>
				</div>
				<div>
					<ScrollArea className="h-72 w-48 rounded-md border border-gray-200">
						<div className="p-4">
							<h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
							{items?.map((tag) => (
								<>
									<div
										key={tag.version}
										className={cn(
											"border-l border-gray-200 pl-3 py-1 text-sm hover:bg-zinc-100 duration-200",
											{ "bg-zinc-100": activeVersion === tag.version },
										)}
									>
										{tag.version}
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
