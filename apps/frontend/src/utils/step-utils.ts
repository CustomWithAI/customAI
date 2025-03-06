import type { Pipeline } from "@/types/request/requestTrainingPreset";

export const getStep = (
	method: "prev" | "next",
	current: string | undefined,
	steps: Pipeline["steps"] | undefined,
): string => {
	const currentIndex = steps?.find((step) => step.name === current)?.index;
	if (!currentIndex) {
		return "";
	}
	switch (method) {
		case "prev":
			if (currentIndex === 0) {
				return "preset";
			}
			return steps.find((step) => step.index === currentIndex - 1)?.name || "";
		case "next":
			if (currentIndex === steps.length - 1) {
				return "start";
			}
			return steps.find((step) => step.index === currentIndex + 1)?.name || "";
	}
};
