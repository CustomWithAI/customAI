import { presetList } from "@/configs/preset";
import { StepKey } from "@/configs/step-key";
import type { Pipeline } from "@/types/request/requestTrainingPreset";

export const getStep = (
	method: "prev" | "next",
	current: string | undefined,
	steps: Pipeline["steps"] | undefined,
	zeroIndexCallback: () => void,
): string => {
	if (current === StepKey.Finish && method === "prev") {
		return (
			steps?.reduce((max, current) => {
				return current.index > max.index ? current : max;
			}, steps?.[0])?.name || ""
		);
	}
	const currentIndex = steps?.find((step) => step.name === current)?.index;
	if (currentIndex === undefined || steps === undefined) {
		return current || "";
	}
	switch (method) {
		case "prev": {
			if (currentIndex === 0) {
				zeroIndexCallback();
				return "preset";
			}
			const prevName = steps?.find(
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
				return StepKey.Finish;
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
