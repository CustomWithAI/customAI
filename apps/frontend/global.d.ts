import type home from "@/locale/en-US/home.json";
import type settings from "@/locale/en-US/settings.json";

type Messages = typeof home & typeof settings;

declare global {
	interface IntlMessages extends Messages {}
}
