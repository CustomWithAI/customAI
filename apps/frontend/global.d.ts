import type common from "@/locale/en-US/common.json";
import type home from "@/locale/en-US/home.json";
import type settings from "@/locale/en-US/settings.json";

type Messages = typeof home & typeof settings & typeof common;

declare global {
	interface IntlMessages extends Messages {}
}
