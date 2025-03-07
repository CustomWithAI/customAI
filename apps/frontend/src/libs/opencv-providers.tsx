"use client";
import { createContext, useContext, useEffect, useState } from "react";

const OpenCVContext = createContext<{
	cv: typeof import("@techstark/opencv-js") | null;
}>({ cv: null });

export const OpenCVProvider = ({ children }: { children: React.ReactNode }) => {
	const [cv, setCv] = useState<typeof import("@techstark/opencv-js") | null>(
		null,
	);

	useEffect(() => {
		async function loadOpenCV() {
			try {
				const opencv = await import("@techstark/opencv-js");
				setCv(opencv);
			} catch (error) {
				console.error("Failed to load OpenCV:", error);
			}
		}

		loadOpenCV();
	}, []);

	return (
		<OpenCVContext.Provider value={{ cv }}>{children}</OpenCVContext.Provider>
	);
};

export const useOpenCV = () => useContext(OpenCVContext);
