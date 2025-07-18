"use client";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { type StoreApi, useStore } from "zustand";

import {
	type DragColumn,
	type DragStore,
	createDragStore,
} from "@/stores/dragStore";
import type { Draft } from "immer";

export const DragStoreContext = createContext<ReturnType<
	typeof createDragStore
> | null>(null);

export interface DragStoreProviderProps {
	initial?: Array<DragColumn>;
	children: ReactNode;
}

export const DragStoreProvider = ({
	initial,
	children,
}: DragStoreProviderProps) => {
	const initialized = useRef(false);
	const [store] = useState(() => {
		const newStore = createDragStore(initial);
		initialized.current = true;
		return newStore;
	});

	return (
		<DragStoreContext.Provider value={store}>
			{children}
		</DragStoreContext.Provider>
	);
};

export const useDragStore = <T,>(selector: (store: DragStore) => T): T => {
	const dragStoreContext = useContext(DragStoreContext);
	if (!dragStoreContext) {
		throw new Error("useDragStore must be used within DragStoreContext");
	}
	return useStore(dragStoreContext, selector);
};
