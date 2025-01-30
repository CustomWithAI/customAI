import {
	CodeBlock,
	Content,
	Header,
	Lead,
	List,
	type ListProps,
	Primary,
	Quote,
	SubHeader,
	Subtle,
	type TextProps,
} from "@/components/typography/text";
import { type FilpWordProps, FlipWords } from "@/components/ui/filp-words";
import type { Meta, StoryObj } from "@storybook/react";
import React, { type ReactNode } from "react";

const meta: Meta = {
	title: "Typography/Text",
	component: Primary,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
};

export default meta;
type TextStory = StoryObj<TextProps>;
type FilpWordStory = StoryObj<FilpWordProps>;

export const PrimaryStory: StoryObj = {
	args: {
		children: "Primary Text Example",
	},
};

export const HeaderStory: TextStory = {
	render: (args) => <Header {...args}>{args.children}</Header>,
	args: {
		children: "Header Text Example",
	},
};

export const SubheaderStory: TextStory = {
	render: (args) => <SubHeader {...args}>{args.children}</SubHeader>,
	args: {
		children: "Subheader Text Example",
	},
};

export const ContentStory: TextStory = {
	render: (args) => <Content {...args}>{args.children}</Content>,
	args: {
		children: "This is body content, typically used for main text in articles.",
	},
};

export const SubtleStory: TextStory = {
	render: (args) => <Subtle {...args}>{args.children}</Subtle>,
	args: {
		children: "Subtle text, great for annotations or secondary information.",
	},
};

export const FilpWordStory: FilpWordStory = {
	render: (args) => <FlipWords {...args} />,
	args: {
		words: ["built", "generate", "make"],
	},
};
export const QuoteStory: TextStory = {
	render: (args) => <Quote {...args}>{args.children}</Quote>,
	args: {
		children: `"This is a blockquote. It's often used for emphasized quotes."`,
	},
};

export const ListStory: StoryObj<ListProps> = {
	render: (args) => <List {...args} />,
	args: {
		childrenList: ["First item", "Second item", "Third item"],
	},
};

export const CodeBlockStory: TextStory = {
	render: (args) => <CodeBlock {...args}>{args.children}</CodeBlock>,
	args: {
		children: `const greet = () => console.log("Hello, World!");`,
	},
};

export const LeadStory: TextStory = {
	render: (args) => <Lead {...args}>{args.children}</Lead>,
	args: {
		children:
			"This is lead text, designed to stand out as a prominent introduction.",
	},
};
