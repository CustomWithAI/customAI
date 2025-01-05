import { AppNavbar } from "@/components/layout/appNavbar";
import { Primary, Subtle } from "@/components/typography/text";
import { QuickAccessBox } from "@/features/homepage/components/quickAccessBox";
import { PackagePlus } from "lucide-react";

export default function Page() {
	return (
		<AppNavbar PageTitle="Welcome" activeTab="Home" disabledTab={undefined}>
			<Primary className="mb-4">Welcome Home</Primary>
			<Subtle className="font-medium">Quick Access</Subtle>
			<div className="grid lg:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 lg:gap-8 gap-4 mb-4">
				<QuickAccessBox
					link="/"
					title="Create a model"
					description="To create your own pipeline."
					icon={<PackagePlus />}
				/>
				<QuickAccessBox
					link="/"
					title="Create a model"
					description="To create your own pipeline."
					icon={<PackagePlus />}
				/>
				<QuickAccessBox
					link="/"
					title="Create a model"
					description="To create your own pipeline."
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
