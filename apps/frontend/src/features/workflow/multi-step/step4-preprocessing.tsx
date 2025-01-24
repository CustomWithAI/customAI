import { Content } from "@/components/typography/text";
import { TablePreprocessingSection } from "@/features/image-preprocessing/sections/table";
import { VisualPreprocessingSection } from "@/features/image-preprocessing/sections/visual";
import { useQueryParam } from "@/hooks/use-query-params";
import { cn } from "@/libs/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const ImagePreprocessingPage = () => {
	const { getQueryParam, setQueryParam, compareQueryParam } = useQueryParam({
		name: "view",
	});
	const viewParam = getQueryParam();
	return (
		<>
			<div id="tab" className="flex p-1 bg-zinc-100 w-fit space-x-1 rounded-lg">
				<button
					type="button"
					onClick={() => {
						setQueryParam({ value: "blueprint", subfix: "#tab" });
					}}
					className={cn("px-4 py-1.5 rounded-md relative", {
						"text-zinc-900": viewParam === "blueprint",
						"text-zinc-500": viewParam !== "blueprint",
					})}
				>
					<Content className="text-sm relative z-10">Blueprint</Content>
					{viewParam === "blueprint" && (
						<motion.div
							layoutId="activeTab"
							className="absolute inset-0 bg-white rounded-md"
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						/>
					)}
				</button>
				<button
					type="button"
					onClick={() => setQueryParam({ value: "table" })}
					className={cn("px-4 py-1.5 rounded-md relative", {
						"text-zinc-900": viewParam === "table",
						"text-zinc-500": viewParam !== "table",
					})}
				>
					<Content className="text-sm relative z-10">Table</Content>
					{viewParam === "table" && (
						<motion.div
							layoutId="activeTab"
							className="absolute inset-0 bg-white rounded-md"
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						/>
					)}
				</button>
			</div>
			{compareQueryParam({ value: "table", allowNull: true }) ? (
				<TablePreprocessingSection />
			) : null}
			{compareQueryParam({ value: "blueprint" }) ? (
				<VisualPreprocessingSection />
			) : null}
		</>
	);
};
