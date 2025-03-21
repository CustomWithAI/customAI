import type { Meta, StoryObj } from "@storybook/react";
import { Bell, CreditCard, Settings, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components/ui/tabs";

const meta = {
	title: "UI/Tabs",
	component: Tabs,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[600px]">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tabs defaultValue="account" className="w-full">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Account Settings</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Update your account settings. Set your preferred language and
						timezone.
					</p>
					<div className="flex gap-2 mt-4">
						<Button>Save Changes</Button>
						<Button variant="outline">Cancel</Button>
					</div>
				</Card>
			</TabsContent>
			<TabsContent value="password">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Change Password</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Update your password to keep your account secure.
					</p>
					<div className="flex gap-2 mt-4">
						<Button>Update Password</Button>
						<Button variant="outline">Cancel</Button>
					</div>
				</Card>
			</TabsContent>
			<TabsContent value="settings">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Other Settings</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Manage your notification preferences and security settings.
					</p>
					<div className="flex gap-2 mt-4">
						<Button>Save Preferences</Button>
						<Button variant="outline">Reset</Button>
					</div>
				</Card>
			</TabsContent>
		</Tabs>
	),
};

export const WithIcons: Story = {
	render: () => (
		<Tabs defaultValue="profile" className="w-full">
			<TabsList className="grid w-full grid-cols-4">
				<TabsTrigger value="profile" className="flex items-center gap-2">
					<User className="h-4 w-4" />
					Profile
				</TabsTrigger>
				<TabsTrigger value="billing" className="flex items-center gap-2">
					<CreditCard className="h-4 w-4" />
					Billing
				</TabsTrigger>
				<TabsTrigger value="notifications" className="flex items-center gap-2">
					<Bell className="h-4 w-4" />
					Notifications
				</TabsTrigger>
				<TabsTrigger value="settings" className="flex items-center gap-2">
					<Settings className="h-4 w-4" />
					Settings
				</TabsTrigger>
			</TabsList>
			<TabsContent value="profile">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Profile Information</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Update your profile information and email settings.
					</p>
				</Card>
			</TabsContent>
			<TabsContent value="billing">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Billing Information</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Manage your billing information and view your invoices.
					</p>
				</Card>
			</TabsContent>
			<TabsContent value="notifications">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Notification Preferences</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Configure how you receive notifications and alerts.
					</p>
				</Card>
			</TabsContent>
			<TabsContent value="settings">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Account Settings</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Manage your account settings and preferences.
					</p>
				</Card>
			</TabsContent>
		</Tabs>
	),
};

export const WithDisabledTabs: Story = {
	render: () => (
		<Tabs defaultValue="active" className="w-full">
			<TabsList>
				<TabsTrigger value="active">Active</TabsTrigger>
				<TabsTrigger value="inactive" disabled>
					Inactive
				</TabsTrigger>
				<TabsTrigger value="archived" disabled>
					Archived
				</TabsTrigger>
			</TabsList>
			<TabsContent value="active">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Active Items</h3>
					<p className="text-sm text-muted-foreground mt-2">
						View and manage your active items.
					</p>
				</Card>
			</TabsContent>
			<TabsContent value="inactive">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Inactive Items</h3>
					<p className="text-sm text-muted-foreground mt-2">
						View your inactive items (requires premium).
					</p>
				</Card>
			</TabsContent>
			<TabsContent value="archived">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Archived Items</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Access your archived items (requires premium).
					</p>
				</Card>
			</TabsContent>
		</Tabs>
	),
};
