import { SingleBeam } from "@/components/common/single-beam";
import { BackgroundBeams } from "@/components/ui/background-beams";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	title: "Components/Beams",
	component: SingleBeam,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
};

export default meta;

export const SingleBeamStory: StoryObj = {
	render: (args) => <SingleBeam path={""} {...args} />,
};

export const backgroundBeamStory: StoryObj = {
	render: (args) => <BackgroundBeams {...args} />,
};
