import { useEffect, useState, useTransition } from "react";
import { useRouter } from "./i18nNavigation";
export const useRouterAsync = () => {
	const [isLoadingRoute, setIsLoadingRoute] = useState(true);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const asyncRoute = async (path: string) => {
		startTransition(() => {
			router.push(path);
		});
	};

	useEffect(() => {
		if (isPending) {
			return setIsLoadingRoute(true);
		}
		setIsLoadingRoute(false);
	}, [isPending]);

	return { asyncRoute, isLoadingRoute };
};
