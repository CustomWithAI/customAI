"use client";

import { usePathname, useRouter } from "next/navigation";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface FlowData {
	[key: string]: any;
}

interface FlowConfig {
	returnPath?: string;
	flowTitle?: string;
}

interface FlowNavigationContextType {
	flowData: FlowData;
	flowOrigin: string | null;
	flowConfig: FlowConfig;
	setFlowOrigin: (path: string | null) => void;
	storeFlowData: (data: any) => void;
	getFlowData: () => FlowData;
	clearFlowData: () => void;
	returnToOrigin: () => void;
	configureFlow: (config: FlowConfig) => void;
}

const FlowNavigationContext = createContext<
	FlowNavigationContextType | undefined
>(undefined);

const STORAGE_KEY_DATA = "flowData";
const STORAGE_KEY_ORIGIN = "flowOrigin";
const STORAGE_KEY_CONFIG = "flowConfig";

export function FlowNavigationProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [flowData, setFlowData] = useState<FlowData>({});
	const [flowOrigin, setFlowOrigin] = useState<string | null>(null);
	const [flowConfig, setFlowConfig] = useState<FlowConfig>({});

	// Load data from localStorage on initial mount
	useEffect(() => {
		try {
			const savedData = localStorage.getItem(STORAGE_KEY_DATA);
			const savedOrigin = localStorage.getItem(STORAGE_KEY_ORIGIN);
			const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);

			if (savedData) {
				setFlowData(JSON.parse(savedData));
			}

			if (savedOrigin) {
				setFlowOrigin(savedOrigin);
			}

			if (savedConfig) {
				setFlowConfig(JSON.parse(savedConfig));
			}
		} catch (error) {
			console.error("Error loading flow data from localStorage:", error);
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(flowData));
		} catch (error) {
			console.error("Error saving flow data to localStorage:", error);
		}
	}, [flowData]);

	useEffect(() => {
		try {
			if (flowOrigin) {
				localStorage.setItem(STORAGE_KEY_ORIGIN, flowOrigin);
			} else {
				localStorage.removeItem(STORAGE_KEY_ORIGIN);
			}
		} catch (error) {
			console.error("Error saving flow origin to localStorage:", error);
		}
	}, [flowOrigin]);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(flowConfig));
		} catch (error) {
			console.error("Error saving flow config to localStorage:", error);
		}
	}, [flowConfig]);

	const storeFlowData = useCallback((data: any) => {
		setFlowData((prev) => {
			const isEqual =
				Object.keys(data).every((key) => prev[key] === data[key]) &&
				Object.keys(data).length === Object.keys(prev).length;

			return isEqual ? prev : { ...prev, ...data };
		});
	}, []);

	const getFlowData = useCallback(() => {
		return flowData;
	}, [flowData]);

	const clearFlowData = useCallback(() => {
		setFlowData({});
		localStorage.removeItem(STORAGE_KEY_DATA);
	}, []);

	const setOrigin = useCallback((path: string | null) => {
		setFlowOrigin(path);
	}, []);

	const returnToOrigin = useCallback(() => {
		if (flowOrigin) {
			router.push(flowOrigin);
			// Don't clear origin here to allow for returning multiple times
		} else {
			// If no origin is set, just go back in history
			router.back();
		}
	}, [flowOrigin, router]);

	const configureFlow = useCallback((config: FlowConfig) => {
		setFlowConfig((prev) => ({
			...prev,
			...config,
		}));
	}, []);

	return (
		<FlowNavigationContext.Provider
			value={{
				flowData,
				flowOrigin,
				flowConfig,
				setFlowOrigin: setOrigin,
				storeFlowData,
				getFlowData,
				clearFlowData,
				returnToOrigin,
				configureFlow,
			}}
		>
			{children}
		</FlowNavigationContext.Provider>
	);
}

export function useFlowNavigation() {
	const context = useContext(FlowNavigationContext);

	if (context === undefined) {
		throw new Error(
			"useFlowNavigation must be used within a FlowNavigationProvider",
		);
	}

	return context;
}

export function useStartFlow() {
	const { setFlowOrigin, configureFlow } = useFlowNavigation();
	const pathname = usePathname();
	const router = useRouter();

	return useCallback(
		(destination: string, config: FlowConfig = {}) => {
			setFlowOrigin(pathname);
			configureFlow(config);
			router.push(destination);
		},
		[pathname, router, setFlowOrigin, configureFlow],
	);
}

export function useConfigureFlow() {
	const { configureFlow } = useFlowNavigation();

	return configureFlow;
}
