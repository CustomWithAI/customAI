import { Content, SubHeader } from "@/components/typography/text";

export const Footer = () => {
	return (
		<>
			<div className="w-full border-t" />
			<div className="grid grid-cols-4 max-sm:grid-cols-1 mx-auto max-w-screen-2xl p-6 lg:p-10 backdrop-blur-sm gap-4">
				<SubHeader>CustomAI</SubHeader>
				<div>
					<Content className="font-semibold">GENERAL</Content>
					<Content>About CustomAI</Content>
					<Content>Public Roadmap</Content>
					<Content>Changelog</Content>
				</div>
				<div>
					<Content className="font-semibold">GET HELP</Content>
					<Content>FAQ</Content>
					<Content>Terms & Conditions</Content>
					<Content>Privacy Policy</Content>
				</div>
				<div>
					<Content className="font-semibold">FOLLOW US</Content>
					<Content>twitter</Content>
				</div>
			</div>
			<div className="w-full h-8" />
		</>
	);
};
