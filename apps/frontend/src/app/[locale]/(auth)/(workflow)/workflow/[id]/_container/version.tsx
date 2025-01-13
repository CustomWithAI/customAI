import { Header } from "@/components/typography/text";
import { ScrollArea } from "@/components/ui/scroll-area";

export const VersionPage = () => {
	const tags = [""];
	return (
		<>
			<Header>version</Header>
			<div className="grid md:grid-cols-4 max-md:grid-cols-1 max-lg:gap-6 lg:gap-8">
				<div className="col-span-1 md:col-span-3">a</div>
				<div>
					<ScrollArea className="h-72 w-48 rounded-md border">
						<div className="p-4">
							<h4 className="border-l mb-4 text-sm font-medium leading-none">
								Tags
							</h4>
							{tags.map((tag) => (
								<>
									<div key={tag} className="text-sm">
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
