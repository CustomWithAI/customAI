import uploadService from "@/services/upload";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useQuery } from "@tanstack/react-query";

export const useGetFile = (
	id: string,
	options?: AppQueryOptions<typeof uploadService.getFile>,
) =>
	useQuery({
		queryKey: ["file", id],
		queryFn: async () => await uploadService.getFile(id),
		...options,
	});
