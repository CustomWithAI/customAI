import { LayoutGrid, LayoutList } from "lucide-react";
import type React from "react";
import { type ReactNode, createContext, useContext, useState } from "react";
import { Button } from "../ui/button";

type ViewListType = "Vertical" | "Grid";

interface ViewListContextType {
	viewList: ViewListType;
	setViewList: React.Dispatch<React.SetStateAction<ViewListType>>;
}

const ViewListContext = createContext<ViewListContextType | undefined>(
	undefined,
);

export const ViewList = {
	Provider: ({ children }: { children: ReactNode }) => {
		const [viewList, setViewList] = useState<ViewListType>("Grid");

		return (
			<ViewListContext.Provider value={{ viewList, setViewList }}>
				{children}
			</ViewListContext.Provider>
		);
	},

	Trigger: () => {
		const context = useContext(ViewListContext);

		if (!context) {
			throw new Error(
				"ViewList.Trigger must be used within a ViewList.Provider",
			);
		}

		const { viewList, setViewList } = context;

		return (
			<div className="flex space-x-2 border border-zinc-200/60 p-1 rounded-lg">
				<Button
					onClick={() => setViewList("Grid")}
					variant={viewList === "Grid" ? "secondary" : "ghost"}
					size="sm"
				>
					<LayoutGrid />
				</Button>
				<Button
					onClick={() => setViewList("Vertical")}
					variant={viewList === "Vertical" ? "secondary" : "ghost"}
					size="sm"
				>
					<LayoutList className="w-5 h-5" />
				</Button>
			</div>
		);
	},

	useViewList: () => {
		const context = useContext(ViewListContext);
		if (!context) {
			throw new Error("useViewList must be used within a ViewList.Provider");
		}
		return context;
	},
	useViewListState: () => {
		const context = useContext(ViewListContext);

		if (!context) {
			throw new Error(
				"useViewListState must be used within a ViewList.Provider",
			);
		}

		return context.viewList;
	},
};
