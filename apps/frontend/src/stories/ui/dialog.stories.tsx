import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/ui/dialog";

const meta = {
	title: "UI/Dialog",
	component: Dialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<>
				<DialogTrigger asChild>
					<Button variant="outline">Open Dialog</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Profile</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when done.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="name" className="text-right">
								Name
							</label>
							<input
								id="name"
								className="col-span-3"
								placeholder="Enter your name"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="username" className="text-right">
								Username
							</label>
							<input
								id="username"
								className="col-span-3"
								placeholder="Enter username"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</>
		),
	},
};

export const WithDestructiveAction: Story = {
	args: {
		children: (
			<>
				<DialogTrigger asChild>
					<Button variant="destructive">Delete Account</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button variant="outline">Cancel</Button>
						<Button variant="destructive">Delete Account</Button>
					</DialogFooter>
				</DialogContent>
			</>
		),
	},
};
