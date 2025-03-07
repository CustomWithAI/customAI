import deepEqual from "fast-deep-equal";
import { useRef } from "react";

export const useStableArray = <T>(array: Array<T>) => {
	const ref = useRef(array);

	if (!deepEqual(ref.current, array)) {
		ref.current = array;
	}

	return ref.current;
};

type Factory<T> = () => T;

function useStableMemo<T>(
	factory: Factory<T>,
	dependencies: React.DependencyList,
): T {
	const ref = useRef<{
		value: T | null;
		dependencies: React.DependencyList | null;
	}>({
		value: null,
		dependencies: null,
	});

	if (
		!ref.current.dependencies ||
		!deepEqual(ref.current.dependencies, dependencies)
	) {
		const newValue = factory();

		if (!deepEqual(ref.current.value, newValue)) {
			ref.current.value = newValue;
		}

		ref.current.dependencies = dependencies;
	}

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	return ref.current.value!;
}

export default useStableMemo;
