import type { Pipeline } from "@/types/request/requestTrainingPreset";

export const getStep = (
	method: "prev" | "next",
	current: string | undefined,
	steps: Pipeline["steps"] | undefined,
): string => {
	const currentIndex = steps?.find((step) => step.name === current)?.index;
	if (!currentIndex) {
		return current || "";
	}
	switch (method) {
		case "prev": {
			if (currentIndex === 0) {
				return "preset";
			}
			const prevName = steps.find(
				(step) => step.index === currentIndex - 1,
			)?.name;
			if (!prevName) {
				console.warn("no previous found:", currentIndex);
				return current || "";
			}
			return prevName;
		}
		case "next": {
			if (currentIndex === steps.length - 1) {
				return "start";
			}
			const nextName = steps.find(
				(step) => step.index === currentIndex + 1,
			)?.name;
			if (!nextName) {
				console.warn("no next found:", currentIndex);
				return current || "";
			}
			return nextName;
		}
	}
};
