import { routing } from "@/i18n/routings";
import { createNavigation } from "next-intl/navigation";

export const { Link, redirect, usePathname, useRouter } =
	createNavigation(routing);
