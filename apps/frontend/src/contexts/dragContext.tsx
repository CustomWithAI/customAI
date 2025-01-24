"use client";
import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";

import {
	type DragColumn,
	type DragStore,
	createDragStore,
} from "@/stores/dragStore";

export const DragStoreContext = createContext<StoreApi<DragStore> | null>(null);

export interface DragStoreProviderProps {
	initial?: Array<DragColumn>;
	children: ReactNode;
}

export const DragStoreProvider = ({
	initial,
	children,
}: DragStoreProviderProps) => {
	const DragRef = useRef<StoreApi<DragStore>>();
	if (!DragRef.current) {
		DragRef.current = createDragStore(initial);
	}

	return (
		<DragStoreContext.Provider value={DragRef.current}>
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
