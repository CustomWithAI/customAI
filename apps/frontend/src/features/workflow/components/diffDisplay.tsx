import type { DiffResult } from "@/utils/diffVersion";

type DiffDisplayProps = {
	data: DiffResult[];
};

type DiffNode = {
	diffs?: DiffResult[];
	children?: Record<string, DiffNode>;
};

function groupDiffs(diffs: DiffResult[]): DiffNode {
	const root: DiffNode = {};

	for (const diff of diffs) {
		const path = diff.title.split(" ");
		const parent = path[0];

		if (!root.children) root.children = {};

		if (!root.children[parent]) {
			root.children[parent] = { diffs: [] };
		}

		root.children[parent]?.diffs?.push({
			...diff,
			old: JSON.stringify(diff.old),
			new: JSON.stringify(diff.new),
		});
	}

	return root;
}

const DiffGroup = ({
	node,
	level = 0,
}: {
	node: DiffNode;
	level?: number;
}) => {
	const entries = Object.entries(node.children ?? {});

	const capitalizeTitle = (key: string) => {
		const formatted = key
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/_/g, " ")
			.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
		return formatted;
	};

	return (
		<div className="ml-4 text-gray-500">
			{entries.map(([key, child]) => (
				<div key={key} className="mb-1">
					<div
						className="font-medium text-sm"
						style={{ marginLeft: level * 3 }}
					>
						{capitalizeTitle(key)}
					</div>
					<DiffGroup node={child} level={level + 1} />
				</div>
			))}

			{node.diffs?.map((diff, i) => (
				<div
					key={i}
					className="text-sm ml-4 flex items-center space-x-1"
					style={{ marginLeft: level * 3 }}
				>
					<span>{diff.title.split(" ").at(-1)}</span>
					<span className="max-w-3xs bg-[#F0F1F8] break-words text-[#747E90] rounded-md px-1.5 py-0.5">
						{diff.old}
					</span>
					<span>to</span>
					<span className="max-w-3xs bg-[#D8FADA] break-words text-[#5B886C] rounded-md px-1.5 py-0.5">
						{diff.new}
					</span>
				</div>
			))}
		</div>
	);
};

export const DiffDisplay = ({ data }: DiffDisplayProps) => {
	const grouped = groupDiffs(data);
	return <DiffGroup node={grouped} />;
};
