import { ThemeProvider, useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";

type ThemeProvidersProps = {
	children: ReactNode;
};

export const ThemeProviders = ({ children }: ThemeProvidersProps) => {
	function ThemeWatcher() {
		const { resolvedTheme, setTheme } = useTheme();

		useEffect(() => {
			const media = window.matchMedia("(prefers-color-scheme: dark)");
			function onMediaChange() {
				const systemTheme = media.matches ? "dark" : "light";
				if (resolvedTheme === systemTheme) {
					setTheme("system");
				}
			}
			onMediaChange();
			media.addEventListener("change", onMediaChange);
			return () => {
				media.removeEventListener("change", onMediaChange);
			};
		}, [resolvedTheme, setTheme]);

		return null;
	}

	return (
		<ThemeProvider attribute="class" disableTransitionOnChange>
			<ThemeWatcher />
			{children}
		</ThemeProvider>
	);
};
