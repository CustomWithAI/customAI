import { Content, SubHeader } from "@/components/typography/text";
import type { ReactNode } from "react";

const FooterList = ({ children }: { children: ReactNode }) => (
	<Content className="text-zinc-500 font-light text-sm leading-6">
		{children}
	</Content>
);

export const Footer = () => {
	return (
		<>
			<div className="w-full border-t" />
			<div className="grid grid-cols-4 max-sm:grid-cols-1 mx-auto max-w-screen-2xl p-6 lg:p-10 backdrop-blur-sm gap-4">
				<SubHeader>CustomAI</SubHeader>
				<div>
					<Content className="font-semibold leading-8">GENERAL</Content>
					<FooterList>About CustomAI</FooterList>
					<FooterList>Public Roadmap</FooterList>
					<FooterList>Changelog</FooterList>
				</div>
				<div>
					<Content className="font-semibold leading-8">GET HELP</Content>
					<FooterList>FAQ</FooterList>
					<FooterList>Terms & Conditions</FooterList>
					<FooterList>Privacy Policy</FooterList>
				</div>
				<div>
					<Content className="font-semibold leading-8">FOLLOW US</Content>
					<FooterList>twitter</FooterList>
				</div>
			</div>
			<div className="w-full h-8" />
		</>
	);
};
