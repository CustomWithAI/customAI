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
		<div id={versionId} className="flex w-full">
			<GitCommitVertical />
			<div className="space-y-1.5 flex-1">
				<div className="flex items-center w-full space-x-2">
					<ContentHeader>{versionId}</ContentHeader>
					{isDefault && <Badge variant="secondary">default</Badge>}
				</div>
				<div className="rounded-lg flex-1 w-full shadow-md border relative px-6 py-5">
					<div className="flex flex-grow items-end gap-x-4 mb-4">
						<ContentHeader>{versionName}</ContentHeader>
						<Subtle className="mb-0.5">
							{formatDistanceToNow(time, { addSuffix: true })}
						</Subtle>
					</div>
					<Content className="font-medium mb-1">change info</Content>
					<div className="flex items-end mb-3">
						{changeInfo.map((info, index) => (
							<Content className="text-sm" key={`${versionId}${time}${index}`}>
								{typeof info === "string" ? (
									<span>{info}</span>
								) : (
									<span
										className={cn(
											"rounded-md px-1.5 mx-1.5 py-0.5",
											{
												"bg-[#F0F1F8] text-[#747E90]":
													info.status === "default",
											},
											{
												"bg-[#D8FADA] text-[#5B886C]":
													info.status === "changed",
											},
										)}
									>
										{info.value}
									</span>
								)}
							</Content>
						))}
					</div>
					<button
						type="button"
						className="font-semibold text-xs text-zinc-600 underline hover:text-blue-500 duration-200"
					>
						show more..
					</button>
					<div className="w-full my-4 border-b" />
					<Content className="font-medium mb-2">Contributor</Content>
					<div className="flex items-center space-x-4">
						<div className="relative max-w-16 max-h-16 aspect-square">
							<div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
								{contributor.imageSrc ? (
									<Image
										src={contributor.imageSrc}
										alt="Profile Picture"
										width={64}
										height={64}
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
