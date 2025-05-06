import { inferenceService } from "@/services/inference";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useQuery } from "@tanstack/react-query";

export const useGetInference = ({
	id,
	options,
}: {
	id: string;
	options?: AppQueryOptions<typeof inferenceService.getInference>;
}) =>
	useQuery({
		queryKey: ["inference", id],
		queryFn: async () => await inferenceService.getInference({ id }),
		...options,
	});

export const useGetInferences = ({
	options,
}: { options?: AppQueryOptions<typeof inferenceService.getInferences> } = {}) =>
	useQuery({
		queryKey: ["inferences"],
		queryFn: async () => await inferenceService.getInferences(),
		...options,
	});
