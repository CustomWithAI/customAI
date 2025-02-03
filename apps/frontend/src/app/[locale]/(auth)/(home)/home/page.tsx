"use client";
import { AppNavbar } from "@/components/layout/appNavbar";
import { BaseSkeleton } from "@/components/specific/skeleton";
import { Primary, Subtle } from "@/components/typography/text";
import { QuickAccessBox } from "@/features/homepage/components/quickAccessBox";
import { authClient } from "@/libs/auth-client";
import { PackagePlus } from "lucide-react";

export default function Page() {
	const { data: session, isPending } = authClient.useSession();
	return (
		<AppNavbar PageTitle="Welcome" activeTab="Home" disabledTab={undefined}>
			<BaseSkeleton loading={isPending}>
				<Primary className="mb-4">Welcome Home, {session?.user.name}</Primary>
			</BaseSkeleton>
			<Subtle className="font-medium">Quick Access</Subtle>
			<div className="grid lg:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 lg:gap-8 gap-4 mb-4">
				<QuickAccessBox
					link="/workflow/create"
					title="Create a model"
					description="To create your own pipeline."
					icon={<PackagePlus />}
				/>
				<QuickAccessBox
					link="/dataset/create"
					title="Create a dataset"
					description="To create your group of dataset."
					icon={<PackagePlus />}
				/>
				<QuickAccessBox
					link="/workflow/123"
					title="View a model"
					description="To view your own pipeline."
					icon={<PackagePlus />}
				/>
				<QuickAccessBox
					link="/"
					title="Create a model"
					description="To create your own pipeline."
					icon={<PackagePlus />}
				/>
			</div>
			<Subtle className="font-medium">Overview Panel</Subtle>
		</AppNavbar>
	);
}
