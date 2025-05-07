import { RenderStatusAlert } from "@/components/common/alertStatus";
import { TableStatic } from "@/components/layout/StaticTable";
import { InfiniteCombobox } from "@/components/layout/inifinityCombobox";
import { Content, Header } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useGetInfTrainingByWorkflowId,
	useGetTrainingById,
} from "@/hooks/queries/training-api";
import { parseCsvToTable } from "@/utils/parseCSV";
import { toCapital } from "@/utils/toCapital";
import { useMemo, useState } from "react";

export const InsightPage = ({ id }: { id: string }) => {
	const [filter, setFilter] = useState<string | null>(null);
	const [selected, setSelected] = useState<string | undefined>(undefined);
	const trainingQuery = useGetInfTrainingByWorkflowId({
		workflowId: id,
		params: {
			search: filter ? `name:${filter}` : "",
		},
		config: { enabled: !!id },
	});

	const { data: training, isFetching: trainingFetching } = useGetTrainingById(
		id,
		selected || "",
		{
			enabled: !!(selected && id),
		},
	);

	const evaluateTable = useMemo(() => {
		if (!training?.data.evaluation) return;
		return parseCsvToTable(training?.data.evaluation, ",", {
			epochs: { type: "bold" },
		});
	}, [training?.data.evaluation]);

	const evaluateImageData = useMemo(() => {
		if (!training?.data.evaluationImage) return;
		return Object.entries(training?.data.evaluationImage);
	}, [training?.data.evaluationImage]);
	return (
		<>
			<Header>Insight Metrics</Header>
			<div className=" max-w-2xs">
				<InfiniteCombobox
					hook={trainingQuery}
					keyExtractor={(training) => String(training.id)}
					itemDisplay={(training) => training.version}
					itemContent={(training) => (
						<div className="flex flex-col">
							<span>{training.version}</span>
							<span className="text-xs text-muted-foreground">
								{training.status}
							</span>
						</div>
					)}
					id={`${id}-trainingId`}
					filter={(f) => setFilter(f)}
					value={selected}
					popoverClassName="z-[999]"
					onChange={(v) => setSelected(v)}
					placeholder="Search training by name..."
					emptyMessage="No training found"
				/>
			</div>
			<Tabs defaultValue="table" className="w-full">
				<TabsList className="grid grid-cols-2 w-[400px]">
					<TabsTrigger value="table">Table Result</TabsTrigger>
					<TabsTrigger value="image">Image</TabsTrigger>
				</TabsList>
				<TabsContent value="table" className="pt-6">
					{evaluateTable ? (
						<TableStatic
							data={evaluateTable.data}
							columns={evaluateTable.columns}
							keyField={id}
						/>
					) : (
						<RenderStatusAlert status={trainingFetching}>
							<div className="text-center py-8 text-muted-foreground border rounded-md border-gray-200">
								No evaluation result found
							</div>
						</RenderStatusAlert>
					)}
				</TabsContent>
				<TabsContent value="image" className="pt-6">
					{(evaluateImageData?.length || 0) > 0 ? (
						evaluateImageData?.map(([key, value]) => (
							<div key={key} className="mb-3">
								<Badge size="xl">{toCapital(key)}</Badge>
								<img src={value} />
							</div>
						))
					) : (
						<RenderStatusAlert status={trainingFetching}>
							<div className="text-center py-8 text-muted-foreground border rounded-md border-gray-200">
								No evaluation result found
							</div>
						</RenderStatusAlert>
					)}
				</TabsContent>
			</Tabs>
		</>
	);
};
