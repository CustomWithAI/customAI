import { useIsomorphicLayoutEffect } from "framer-motion";
import { useState } from "react";
import { useDebounceCallback } from "./useDebounceCallback";
import { useEventListener } from "./useEventListener";

type WindowSize<T extends number | undefined = number | undefined> = {
	width: T;
	height: T;
};

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
	initializeWithValue: InitializeWithValue;
	debounceDelay?: number;
};

const IS_SERVER = typeof window === "undefined";

// SSR version of useWindowSize.
export function useWindowSize(options: UseWindowSizeOptions<false>): WindowSize;
// CSR version of useWindowSize.
export function useWindowSize(
	options?: Partial<UseWindowSizeOptions<true>>,
): WindowSize<number>;
export function useWindowSize(
	options: Partial<UseWindowSizeOptions<boolean>> = {},
): WindowSize | WindowSize<number> {
	let { initializeWithValue = true } = options;
	if (IS_SERVER) {
		initializeWithValue = false;
	}

	const [windowSize, setWindowSize] = useState<WindowSize>(() => ({
		width: undefined,
		height: undefined,
	}));

	const debouncedSetWindowSize = useDebounceCallback(
		setWindowSize,
		options.debounceDelay,
	);

	function handleSize() {
		const setSize = options.debounceDelay
			? debouncedSetWindowSize
			: setWindowSize;

		setSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}

	useEventListener("resize", handleSize);

	useIsomorphicLayoutEffect(() => {
		if (initializeWithValue) {
			handleSize();
		}
	}, []);

	return windowSize;
}
