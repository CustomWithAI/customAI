import { Content, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { DatasetCard } from "@/features/dataset/components/gridBox";
import { useQueryParam } from "@/hooks/use-query-params";
import { encodeBase64 } from "@/libs/base64";
import { Plus } from "lucide-react";
import { useCallback } from "react";

export const DatasetPage = () => {
	const { setQueryParam } = useQueryParam({ name: "step" });

	const handleSubmit = useCallback(() => {
		setQueryParam({ value: encodeBase64("preprocessing"), resetParams: true });
	}, [setQueryParam]);

	const handlePrevious = useCallback(() => {
		setQueryParam({ value: encodeBase64("preset"), resetParams: true });
	}, [setQueryParam]);

	return (
		<div className="flex flex-col gap-y-4">
			<Subtle>Recent dataset used</Subtle>
			<div>
				<DatasetCard
					title={""}
					description={""}
					imagesCount={0}
					href={""}
					images={[]}
				/>
			</div>
			<Subtle>Create new dataset</Subtle>
			<button
				type="button"
				className="w-64 h-48 hover:border-blue-700 hover:bg-zinc-50 hover:shadow-sm duration-150 active:scale-95 transition-transform border rounded-lg flex flex-col justify-center items-center"
			>
				<Plus className="mb-6" />
				<Content>Create a dataset</Content>
				<Subtle className="text-center">
					Start from uploading image to annotation
				</Subtle>
			</button>
			<div className="flex justify-end w-full space-x-4 mt-6">
				<Button variant="ghost">Previous</Button>
				<Button onClick={handleSubmit} type="submit">
					Next
				</Button>
			</div>
		</div>
	);
};
