"use client";
import { useRouter } from "@/libs/i18nNavigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../ui/button";
import { GuestNavbar } from "./guestNavbar";

export const HomeMenu = () => {
	const t = useTranslations("HomePage");
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const router = useRouter();
	return (
		<div className="w-full sticky top-0 flex justify-between px-10 py-4 border-b">
			<GuestNavbar />
			<div className="flex space-x-3">
				<div className=" border" />
				<Button onClick={() => router.push("/login")} variant="ghost">
					{t("login")}
				</Button>
				<Button
					className=" bg-indigo-900 hover:bg-indigo-950 dark:opacity-40 dark:bg-indigo-900 dark:hover:bg-indigo-950"
					onClick={() => router.push("/signup")}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{t("get_started")} {isHovered ? <ArrowRight /> : <ChevronRight />}
				</Button>
			</div>
		</div>
	);
};
