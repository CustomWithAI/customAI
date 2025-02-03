import { useState } from "react";

export const useArrayState = <T,>(initialState: T[] = []) => {
	const [state, setState] = useState<T[]>(initialState);

	const add = (newValue: T) => {
		setState((currentState) => [...currentState, newValue]);
	};

	const remove = (index: number) => {
		setState((currentState) => {
			const newState = [...currentState];
			newState.splice(index, 1);
			return newState;
		});
	};

	const clear = () => {
		setState([]);
	};

	const set = (newArray: T[]) => {
		setState(newArray);
	};

	const update = (index: number, newValue: T) => {
		setState((currentState) =>
			currentState.map((item, i) => (i === index ? newValue : item)),
		);
	};

	const filter = (callback: (item: T, index: number) => boolean) => {
		setState((currentState) => currentState.filter(callback));
	};

	const replace = (index: number, newValue: T) => {
		setState((currentState) => {
			if (index < 0 || index >= currentState.length) return currentState;
			const newState = [...currentState];
			newState[index] = newValue;
			return newState;
		});
	};

	return [state, { add, remove, clear, set, update, filter, replace }] as const;
};
