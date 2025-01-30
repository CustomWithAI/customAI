import { useCallback, useEffect, useState } from "react";

type ScreenSize = "sm" | "md" | "lg" | "xl" | ">xl";

const breakpoints: Record<ScreenSize, number> = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	">xl": Number.POSITIVE_INFINITY,
};

const getScreenSize = (width: number): ScreenSize => {
	if (width < breakpoints.sm) return "sm";
	if (width < breakpoints.md) return "md";
	if (width < breakpoints.lg) return "lg";
	if (width < breakpoints.xl) return "xl";
	return ">xl";
};

export const useSizeScreen = () => {
	const [size, setSize] = useState<ScreenSize>(() =>
		getScreenSize(window.innerWidth),
	);

	useEffect(() => {
		const handleResize = () => setSize(getScreenSize(window.innerWidth));

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const isLessThan = useCallback(
		(target: ScreenSize) => {
			return breakpoints[size] < breakpoints[target];
		},
		[size],
	);

	const isMoreThan = useCallback(
		(target: ScreenSize) => {
			return breakpoints[size] > breakpoints[target];
		},
		[size],
	);

	return { size, isLessThan, isMoreThan };
};
