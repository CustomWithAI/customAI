import { STEPS } from "@/configs/step-key";
import type { Pipeline } from "@/types/request/requestTrainingPreset";

export const findInSteps = (
	steps: Pipeline["steps"] | undefined,
	name: string,
): Pipeline["steps"][number] | undefined => {
	if (!steps) {
		return undefined;
	}
	const step = steps.find((step) => step.name === name);
	if (!step) {
		return undefined;
	}
	return step;
};

export function removeStepByName(
	steps: Pipeline["steps"],
	nameToRemove: string,
): Pipeline["steps"] {
	const indexToRemove = steps.findIndex((step) => step.name === nameToRemove);

	if (indexToRemove === -1) {
		console.warn(`Step with name "${nameToRemove}" not found.`);
		return steps;
	}

	const newSteps = steps
		.filter((_, idx) => idx !== indexToRemove)
		.map((step, i) => ({ ...step, index: i }));

	return newSteps;
}

export const getStep = (
	method: "prev" | "next",
	current: string | undefined,
	steps: Pipeline["steps"] | undefined,
	zeroIndexCallback: () => void,
): string => {
	if (current === STEPS.Finish && method === "prev") {
		return (
			steps?.reduce((max, current) => {
				return current.index > max.index ? current : max;
			}, steps?.[0])?.name || ""
		);
	}
	const currentIndex = steps?.find((step) => step.name === current)?.index;
	if (currentIndex === undefined || steps === undefined) {
		return "preset";
	}
	switch (method) {
		case "prev": {
			if (currentIndex === 0) {
				console.warn("index is 0");
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
				return STEPS.Finish;
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

export function addStepAtIndex(
	steps: Pipeline["steps"],
	index: number,
	newStep: Omit<Pipeline["steps"][number], "index">,
): Pipeline["steps"] {
	const stepWithIndex = { ...newStep, index };

	const newSteps = [
		...steps.slice(0, index),
		stepWithIndex,
		...steps.slice(index),
	];

	return newSteps;
}

export function addStepAfterName(
	steps: Pipeline["steps"],
	afterName: string,
	newStep: Omit<Pipeline["steps"][number], "index">,
): Pipeline["steps"] {
	const isExisted = steps.find((step) => step.name === newStep.name);
	if (isExisted) {
		console.error(`Step with name "${newStep}" is already exist`);
	}
	const afterIndex = steps.findIndex((step) => step.name === afterName);

	if (afterIndex === -1) {
		console.error(`Step with name "${afterName}" not found.`);
		return steps;
	}

	const stepWithIndex = { ...newStep, index: steps[afterIndex].index + 1 };

	const newSteps = [
		...steps.slice(0, afterIndex + 1),
		stepWithIndex,
		...steps
			.slice(afterIndex + 1)
			.map((step) => ({ ...step, index: step.index + 1 })),
	];

	return newSteps;
}
