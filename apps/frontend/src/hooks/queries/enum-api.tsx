import { enumService } from "@/services/enum";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useQuery } from "@tanstack/react-query";

export const useGetEnum = (
	options?: AppQueryOptions<typeof enumService.getEnum>,
) =>
	useQuery({
		queryFn: enumService.getEnum,
		queryKey: ["enum"],
		...options,
	});
