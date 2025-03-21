import type { Meta, StoryObj } from "@storybook/react";
import {
	Code2,
	FileText,
	Github,
	Laptop,
	LayoutDashboard,
	Settings,
	Users,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "../../components/ui/navigation-menu";

const meta = {
	title: "UI/NavigationMenu",
	component: NavigationMenu,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[800px] h-[400px] flex items-start justify-center p-8">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="grid gap-3 p-6 w-[400px]">
							<div className="flex items-center gap-2">
								<Laptop className="h-4 w-4" />
								<h4 className="text-sm font-medium">Quick Start Guide</h4>
							</div>
							<p className="text-sm text-muted-foreground">
								Learn the basics and get started with our platform in minutes.
							</p>
							<div className="grid grid-cols-2 gap-3 mt-4">
								<Button variant="outline" className="justify-start">
									<FileText className="mr-2 h-4 w-4" />
									Documentation
								</Button>
								<Button variant="outline" className="justify-start">
									<Code2 className="mr-2 h-4 w-4" />
									API Reference
								</Button>
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						href="https://github.com"
						className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-100 hover:text-indigo-900"
					>
						<Github className="mr-2 h-4 w-4" />
						GitHub
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Resources</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="grid gap-3 p-6 w-[500px] grid-cols-2">
							<Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
								<Users className="h-6 w-6 mb-2" />
								<h4 className="text-sm font-medium mb-1">Community</h4>
								<p className="text-xs text-muted-foreground">
									Join our community and get help from other developers.
								</p>
							</Card>
							<Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
								<LayoutDashboard className="h-6 w-6 mb-2" />
								<h4 className="text-sm font-medium mb-1">Examples</h4>
								<p className="text-xs text-muted-foreground">
									Explore example projects and implementations.
								</p>
							</Card>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

export const WithIndicator: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Products</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="grid gap-3 p-4 w-[400px]">
							<NavigationMenuLink
								href="#"
								className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
							>
								<div className="text-sm font-medium leading-none">
									Product 1
								</div>
								<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
									Description for Product 1
								</p>
							</NavigationMenuLink>
							<NavigationMenuLink
								href="#"
								className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
							>
								<div className="text-sm font-medium leading-none">
									Product 2
								</div>
								<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
									Description for Product 2
								</p>
							</NavigationMenuLink>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="grid gap-3 p-4 w-[400px]">
							<NavigationMenuLink
								href="#"
								className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
							>
								<div className="text-sm font-medium leading-none">
									Enterprise
								</div>
								<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
									Enterprise-grade solutions for large organizations
								</p>
							</NavigationMenuLink>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger disabled>
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="p-4 w-[200px]">
							<p className="text-sm">Settings content</p>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};
