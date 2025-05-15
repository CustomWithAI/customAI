import { axiosClient } from "@/libs/api-client";
import type { ResponsePagination } from "@/types/common";
import type { ResponseLog } from "@/types/logs";

export const logService = {
	getLogs: async (
		{
			id,
			trainingId,
			pageParam,
		}: { pageParam: string | null; id?: string; trainingId?: string } = {
			pageParam: null,
			id: "",
			trainingId: "",
		},
	) => {
		try {
			const response = await axiosClient.get<ResponsePagination<ResponseLog>>(
				`/workflows/${id}/trainings/${trainingId}/logs${pageParam || ""}`,
			);
			return response?.data;
		} catch (error) {}
	},
};
