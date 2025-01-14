import { Content, ContentHeader, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { formatDistanceToNow } from "date-fns";
import { GitCommitVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export type VersionSectionProps = {
	versionId: string;
	versionName: string;
	isDefault?: boolean;
	time: string | number | Date;
	contributor: { imageSrc: string; name: string };
	changeInfo: (string | { value: string; status: "default" | "changed" })[];
};

export const VersionSection = ({
	versionId,
	versionName,
	time,
	contributor,
	changeInfo,
	isDefault = false,
}: VersionSectionProps) => {
	const t = useTranslations();
	return (
		<div className="flex">
			<GitCommitVertical />
			<div>
				<div className="flex items-end">
					<ContentHeader>{versionId}</ContentHeader>
					{isDefault && <Badge>default</Badge>}
				</div>
				<div className="rounded-lg shadow-md border relative">
					<div className="flex gap-x-4">
						<ContentHeader>{versionName}</ContentHeader>
						<Subtle>{formatDistanceToNow(time, { addSuffix: true })}</Subtle>
					</div>
					<Content className="font-medium">change info</Content>
					{changeInfo.map((info, index) => (
						<div key={`${versionId}${time}${index}`}>
							{typeof info === "string" ? (
								<Content>{info}</Content>
							) : (
								<Content
									className={cn(
										"rounded-md px-3 py-1.5",
										{
											"bg-[#747E90] text-[#747E90]": info.status === "default",
										},
										{
											"bg-[#D8FADA] text-[#5B886C]": info.status === "changed",
										},
									)}
								>
									{info.value}
								</Content>
							)}
						</div>
					))}
					<Button
						variant="ghost"
						className="font-semibold text-zinc-600 underline"
					>
						show more..
					</Button>
					<div className="w-full my-4 border-b" />
					<Content className="font-medium">change info</Content>
					<div className="flex">
						<div className="relative max-w-64 max-h-64 aspect-square">
							<div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
								{contributor.imageSrc ? (
									<Image
										src={contributor.imageSrc}
										alt="Profile Picture"
										width={128}
										height={128}
										className="object-cover"
									/>
								) : (
									<span className="text-gray-500">
										{t("Account.ProfileImg")}
									</span>
								)}
							</div>
						</div>
						<Content className="text-blue-600">{contributor.name}</Content>
					</div>
				</div>
			</div>
		</div>
	);
};
