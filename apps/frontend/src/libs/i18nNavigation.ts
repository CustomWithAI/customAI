import { routing } from "@/i18n/routings";
import { createNavigation } from "next-intl/navigation";
import { useEffect, useState, useTransition } from "react";

export const { Link, redirect, usePathname, useRouter } =
	createNavigation(routing);

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
