"use client";

import { type LayerConfig, useModelStore } from "@/stores/modelStore";
import { useState } from "react";

interface UseModelConfigProps {
	onExportCallback?: (data: LayerConfig[]) => void;
	onImportCallback?: (data: LayerConfig[]) => boolean | Promise<boolean>;
}

export function useModelConfig({
	onExportCallback,
	onImportCallback,
}: UseModelConfigProps = {}) {
	const { layers, importConfig } = useModelStore();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleImport = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const input = prompt("Paste your layer configuration JSON:");
			if (!input) {
				setIsLoading(false);
				return;
			}

			let parsedData: LayerConfig[] = [];
			try {
				parsedData = JSON.parse(
					input.replace(/$$/g, '["').replace(/$$/g, '"]'),
				);
				if (!Array.isArray(parsedData)) {
					throw new Error("Invalid format: expected an array of layers");
				}
			} catch (e) {
				setError("Failed to parse JSON. Please check the format.");
				setIsLoading(false);
				return;
			}

			if (onImportCallback) {
				const callbackResult = await Promise.resolve(
					onImportCallback(parsedData),
				);
				if (!callbackResult) {
					setError("Import was rejected by the callback handler");
					setIsLoading(false);
					return;
				}
			}

			const success = importConfig(input);
			if (!success) {
				setError("Failed to import configuration. Please check the format.");
			}

			setIsLoading(false);
		} catch (error) {
			setError("An error occurred while importing the configuration.");
			setIsLoading(false);
			console.error(error);
		}
	};

	const handleExport = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const exportData = layers.map((layer) => {
				const exportLayer = JSON.parse(JSON.stringify(layer));
				for (const key of Object.keys(exportLayer)) {
					if (
						typeof exportLayer[key] === "string" &&
						exportLayer[key].startsWith('["') &&
						exportLayer[key].endsWith('"]')
					) {
						exportLayer[key] = exportLayer[key]
							.replace(/\["/g, "(")
							.replace(/"\]/g, ")");
					}
				}
				return exportLayer;
			});

			if (onExportCallback) {
				onExportCallback(exportData);
			}

			const jsonStr = JSON.stringify(exportData, null, 2);
			const formattedStr = jsonStr.replace(/"($$.*?$$)"/g, "$1");

			const blob = new Blob([formattedStr], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "nn_config.json";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			setIsLoading(false);
		} catch (error) {
			setError("Failed to export configuration.");
			setIsLoading(false);
			console.error(error);
		}
	};

	return {
		handleImport,
		handleExport,
		isLoading,
		error,
	};
}
