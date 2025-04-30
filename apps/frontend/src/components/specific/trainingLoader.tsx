"use client";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { useRouterAsync } from "@/libs/i18nAsyncRoute";
import { useRouter } from "@/libs/i18nNavigation";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, {
	useState,
	useEffect,
	useImperativeHandle,
	forwardRef,
	useRef,
} from "react";
import { MultiStepLoader } from "../ui/multi-step-loader";

const CheckIcon = ({ className }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className={cn("w-6 h-6 ", className)}
		>
			<path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
		</svg>
	);
};

const CheckFilled = ({ className }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={cn("w-6 h-6 ", className)}
		>
			<path
				fillRule="evenodd"
				d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
				clipRule="evenodd"
			/>
		</svg>
	);
};

const CheckFailed = ({ className }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={cn("w-6 h-6 text-red-500", className)}
		>
			<path
				fillRule="evenodd"
				d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
				clipRule="evenodd"
			/>
		</svg>
	);
};

interface LoadingState {
	text: string;
	status?: "success" | "failed";
	message?: string;
}

export interface MultiStepLoaderRefHandle {
	startLoading: (params?: any) => Promise<void>;
	stopLoading: () => void;
	isLoading: boolean;
	loadingStates: LoadingState[];
}

const EnhancedLoaderCore = ({
	loadingStates,
	handleAutoClose,
	value = 0,
}: {
	loadingStates: LoadingState[];
	handleAutoClose: (config?: {
		redirect?: true;
		error?: true;
		message?: string;
	}) => void;
	value?: number;
}) => {
	if (loadingStates.at(value)?.status === "failed") {
		setTimeout(
			() =>
				handleAutoClose({
					error: true,
					message: loadingStates.at(value)?.text,
				}),
			3000,
		);
	}
	if (loadingStates.at(value)?.text === "Training job queued successfully") {
		setTimeout(() => handleAutoClose({ redirect: true }), 3000);
	}
	return (
		<div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
			{loadingStates.map((loadingState, index) => {
				const distance = Math.abs(index - value);
				const opacity = Math.max(1 - distance * 0.2, 0);

				const showFailedIcon =
					loadingState.status === "failed" && index <= value;
				const showSuccessIcon =
					(loadingState.status === "success" || !loadingState.status) &&
					index <= value;
				const isPending = index === value && !loadingState.status;

				const textColorClass = (() => {
					if (index === value) {
						if (loadingState.status === "failed") return "text-red-500";
						if (loadingState.status === "success")
							return "text-lime-500 dark:text-lime-500";
						return "text-black dark:text-lime-500";
					}
					return "text-black dark:text-white";
				})();

				return (
					<motion.div
						key={index}
						className={cn("text-left flex gap-2 mb-4")}
						initial={{ opacity: 0, y: -(value * 40) }}
						animate={{ opacity: opacity, y: -(value * 40) }}
						transition={{ duration: 0.5 }}
					>
						<div>
							{index > value && (
								<CheckIcon className="text-black dark:text-white" />
							)}
							{showSuccessIcon && (
								<CheckFilled
									className={cn(
										"text-black dark:text-white",
										value === index &&
											"text-black dark:text-lime-500 opacity-100",
									)}
								/>
							)}
							{showFailedIcon && <CheckFailed />}
						</div>
						<div className="flex flex-col">
							<span className={cn(textColorClass)}>{loadingState.text}</span>
							{loadingState.status === "failed" && loadingState.message && (
								<span className="text-sm text-red-500">
									{loadingState.message}
								</span>
							)}
							{isPending && (
								<span className="text-sm text-gray-500 dark:text-gray-400">
									Processing...
								</span>
							)}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};

const EnhancedMultiStepLoader = ({
	loadingStates,
	loading,
	handleAutoClose,
	duration = 1000,
	loop = false,
	onClose,
}: {
	loadingStates: LoadingState[];
	loading?: boolean;
	handleAutoClose: (config?: {
		redirect?: true;
		error?: true;
		message?: string;
	}) => void;
	duration?: number;
	loop?: boolean;
	onClose?: () => void;
}) => {
	const [currentState, setCurrentState] = useState(0);

	useEffect(() => {
		if (!loading && !currentState) {
			setCurrentState(0);
			return;
		}
		const timeout = setTimeout(() => {
			setCurrentState((prevState) => {
				return loop
					? prevState === loadingStates.length - 1
						? 0
						: prevState + 1
					: Math.min(prevState + 1, loadingStates.length - 1);
			});
		}, duration);

		return () => clearTimeout(timeout);
	}, [currentState, loading, loop, loadingStates.length, duration]);

	return (
		<AnimatePresence mode="wait">
			{loading && (
				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					exit={{
						opacity: 0,
					}}
					className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
				>
					<div className="h-96 relative">
						<EnhancedLoaderCore
							value={currentState}
							handleAutoClose={handleAutoClose}
							loadingStates={loadingStates}
						/>
					</div>

					<div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />

					{onClose && (
						<button
							className="fixed top-4 right-4 text-black dark:text-white z-[120]"
							onClick={onClose}
						>
							<IconSquareRoundedX className="h-10 w-10" />
						</button>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const MultiStepLoaderController = forwardRef<
	MultiStepLoaderRefHandle,
	{
		endpoint?: string;
		errorCallback?: (error: string | undefined) => void;
		routeCallback?: string;
		autoCloseDelay?: number;
	}
>(
	(
		{ endpoint = "", errorCallback, autoCloseDelay = 5000, routeCallback },
		ref,
	) => {
		const [loading, setLoading] = useState(false);
		const router = useRouter();
		const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);
		const abortControllerRef = useRef<AbortController | null>(null);

		const handleAutoClose = (config?: {
			redirect?: true;
			error?: true;
			message?: string;
		}) => {
			setLoading(false);
			streamMutation.reset();
			if (config?.redirect) {
				routeCallback && router.push(routeCallback);
			}
			if (config?.error) {
				errorCallback?.(config?.message);
			}
		};

		const cancelCurrentRequest = () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
				abortControllerRef.current = null;
			}
		};

		const streamMutation = useMutation({
			mutationFn: async (params: any) => {
				cancelCurrentRequest();
				const abortController = new AbortController();
				abortControllerRef.current = abortController;
				setLoadingStates([]);

				try {
					const response = await axios.post(
						`${env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
						params,
						{
							responseType: "stream",
							signal: abortControllerRef.current.signal,
							onDownloadProgress: (progressEvent) => {
								const xhr = progressEvent.event?.target as XMLHttpRequest;
								if (xhr?.responseText) {
									try {
										const lines = xhr.responseText
											.split("\n")
											.filter((line) => line.trim())
											.map((line) => {
												try {
													const parsed = JSON.parse(line);
													return {
														text: parsed.text,
														status: parsed.status,
														message: parsed.message,
													} as LoadingState;
												} catch (e) {
													return { text: line };
												}
											});

										setLoadingStates(lines);
									} catch (error) {
										if (!axios.isCancel(error)) {
											console.error("Error parsing stream data:", error);
										}
									}
								}
							},
						},
					);

					return response.data;
				} catch (error) {
					if (!axios.isCancel(error)) {
						console.error("Error parsing stream data:", error);
					}
					handleAutoClose();
					throw error;
				} finally {
					if (abortControllerRef.current === abortController) {
						abortControllerRef.current = null;
					}
				}
			},
		});

		useImperativeHandle(ref, () => ({
			startLoading: async (params = { message: "start process" }) => {
				cancelCurrentRequest();
				setLoading(true);
				setLoadingStates([]);
				return streamMutation.mutateAsync(params);
			},
			stopLoading: () => {
				cancelCurrentRequest();
				setLoading(false);
				setLoadingStates([]);
				streamMutation.reset();
			},
			get isLoading() {
				return loading || streamMutation.isPending;
			},
			get loadingStates() {
				return loadingStates;
			},
		}));

		const fallbackLoadingStates: LoadingState[] = [
			{ text: "Connecting to server" },
			{ text: "Initializing process" },
			{ text: "Please wait..." },
		];

		const displayLoadingStates =
			loadingStates.length > 0 ? loadingStates : fallbackLoadingStates;

		const handleStopLoading = () => {
			setLoading(false);
			streamMutation.reset();
		};

		console.log(loadingStates);

		return (
			<EnhancedMultiStepLoader
				loadingStates={displayLoadingStates}
				handleAutoClose={handleAutoClose}
				loading={loading}
				duration={2000}
				loop={false}
				onClose={handleStopLoading}
			/>
		);
	},
);

MultiStepLoaderController.displayName = "MultiStepLoaderController";
