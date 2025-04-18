"use client";

import { usePathname, useRouter } from "@/libs/i18nNavigation";
import { useSearchParams } from "next/navigation";
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
	returnPath?: string | "auto";
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
	resetFlow: () => void;
	hasReturnedFromFlow: boolean;
	setHasReturnedFromFlow: (value: boolean) => void;
}

const FlowNavigationContext = createContext<
	FlowNavigationContextType | undefined
>(undefined);

const STORAGE_KEY_DATA = "flowData";
const STORAGE_KEY_ORIGIN = "flowOrigin";
const STORAGE_KEY_CONFIG = "flowConfig";
const STORAGE_KEY_RETURNED = "flowReturned";

export function FlowNavigationProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [flowData, setFlowData] = useState<FlowData>({});
	const [flowOrigin, setFlowOrigin] = useState<string | null>(null);
	const [flowConfig, setFlowConfig] = useState<FlowConfig>({});
	const [hasReturnedFromFlow, setHasReturnedFromFlow] =
		useState<boolean>(false);

	useEffect(() => {
		try {
			const savedData = localStorage.getItem(STORAGE_KEY_DATA);
			const savedOrigin = localStorage.getItem(STORAGE_KEY_ORIGIN);
			const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
			const savedReturned = localStorage.getItem(STORAGE_KEY_RETURNED);

			if (savedData) {
				setFlowData(JSON.parse(savedData));
			}

			if (savedOrigin) {
				setFlowOrigin(savedOrigin);
			}

			if (savedConfig) {
				setFlowConfig(JSON.parse(savedConfig));
			}

			if (savedReturned === "true") {
				setHasReturnedFromFlow(true);
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
			localStorage.setItem(
				STORAGE_KEY_RETURNED,
				hasReturnedFromFlow ? "true" : "false",
			);
		} catch (error) {
			console.error(
				"Error saving flow returned status to localStorage:",
				error,
			);
		}
	}, [hasReturnedFromFlow]);

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
			setHasReturnedFromFlow(true);
			router.push(flowOrigin);
		} else {
			router.back();
		}
	}, [flowOrigin, router]);

	const resetFlow = useCallback(() => {
		setFlowData({});
		setFlowOrigin(null);
		setFlowConfig({});
		setHasReturnedFromFlow(false);

		localStorage.removeItem(STORAGE_KEY_DATA);
		localStorage.removeItem(STORAGE_KEY_ORIGIN);
		localStorage.removeItem(STORAGE_KEY_CONFIG);
		localStorage.removeItem(STORAGE_KEY_RETURNED);
	}, []);

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
				resetFlow,
				hasReturnedFromFlow,
				setHasReturnedFromFlow,
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
	const { setFlowOrigin, configureFlow, setHasReturnedFromFlow } =
		useFlowNavigation();
	const pathname = usePathname();
	const queryString = useSearchParams();
	const router = useRouter();

	return useCallback(
		(destination: string, config: FlowConfig = {}) => {
			setHasReturnedFromFlow(false);
			if (config.returnPath === "auto") {
				config.returnPath = `${pathname}?${queryString}`;
			}
			if (config.returnPath) {
				setFlowOrigin(config.returnPath);
			}
			configureFlow(config);
			router.push(destination);
		},
		[
			pathname,
			router,
			queryString,
			setFlowOrigin,
			configureFlow,
			setHasReturnedFromFlow,
		],
	);
}

export function useConfigureFlow() {
	const { configureFlow } = useFlowNavigation();

	return configureFlow;
}

export function useIsSubFlow() {
	const { flowOrigin, hasReturnedFromFlow } = useFlowNavigation();

	return !!flowOrigin && !hasReturnedFromFlow;
}
