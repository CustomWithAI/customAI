Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

import { SidebarProvider } from "@/components/ui/sidebar";
import { render as rtlRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";

const messages: AbstractIntlMessages = {
	Search: "Search",
	"Ask AI": "Ask AI",
	Home: "Home",
	Inbox: "Inbox",
	Calendar: "Calendar",
	Settings: "Settings",
	Templates: "Templates",
	Trash: "Trash",
	Help: "Help",
	"Custom AI": "Custom AI",
	Enterprise: "Enterprise",
};

// Mock next-intl hooks
jest.mock("next-intl", () => ({
	...jest.requireActual("next-intl"),
	useTranslations: () => (key: string) => messages[key] || key,
	useLocale: () => "en",
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<NextIntlClientProvider messages={messages} locale="en" timeZone="UTC">
			<SidebarProvider>{children}</SidebarProvider>
		</NextIntlClientProvider>
	);
};

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
