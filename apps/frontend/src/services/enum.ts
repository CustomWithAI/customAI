import { axiosClient } from "@/libs/api-client";
import type { EnumType } from "@/types/enum";

export const enumService = {
	getEnum: () => {
		try {
			return axiosClient.get<EnumType>("/enum");
		} catch (error) {}
	},
};
