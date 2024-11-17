import { AppNavbar } from "@/components/layout/appNavbar";
import { Primary } from "@/components/typography/text";

export default function Page() {
	return (
		<AppNavbar activeTab="Home" disabledTab={undefined}>
			<Primary>Welcome Home</Primary>
		</AppNavbar>
	);
}
