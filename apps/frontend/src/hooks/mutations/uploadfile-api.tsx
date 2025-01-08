import uploadService from "@/services/upload";
import type { AppMutationOptions } from "@/types/tanstack-type";
import { useMutation } from "@tanstack/react-query";

export const useUploadFile = (
	options?: Partial<AppMutationOptions<typeof uploadService.uploadFile>>,
) => {
	return useMutation({
		mutationFn: uploadService.uploadFile,
		...options,
	});
};
