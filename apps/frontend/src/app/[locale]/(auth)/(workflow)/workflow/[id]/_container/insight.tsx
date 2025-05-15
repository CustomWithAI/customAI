import { RenderStatusAlert } from "@/components/common/alertStatus";
import { TableStatic } from "@/components/layout/StaticTable";
import { InfiniteLog } from "@/components/layout/infinityLog";
import { InfiniteCombobox } from "@/components/layout/inifinityCombobox";
import { Content, Header } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelEvaluationDashboard } from "@/features/workflow/components/modelEvaluationDashboard";
import { useGetLogs } from "@/hooks/queries/log-api";
import {
	useGetDataTrainingById,
	useGetInfTrainingByWorkflowId,
	useGetTrainingById,
} from "@/hooks/queries/training-api";
import { useQueryParam } from "@/hooks/use-query-params";
import { decodeBase64 } from "@/libs/base64";
import { parseCsvToTable } from "@/utils/parseCSV";
import { toCapital } from "@/utils/toCapital";
import { useEffect, useMemo, useState } from "react";

export const InsightPage = ({ id }: { id: string }) => {
	const { getQueryParam } = useQueryParam({ name: id });
	const [filter, setFilter] = useState<string | null>(null);
	const [selected, setSelected] = useState<string | undefined>(
		decodeBase64(getQueryParam() || "") || undefined,
	);
	const [trainingToFetch, setTrainingToFetch] = useState<string | null>(null);

	const trainingQuery = useGetInfTrainingByWorkflowId({
		workflowId: id,
		params: {
			search: filter ? `name:${filter}` : "",
		},
		config: { enabled: !!id },
	});

	const trainingIdQuery = useGetDataTrainingById(id, trainingToFetch || "", {
		enabled: !!trainingToFetch,
	});

	const {
		data: training,
		isFetching: trainingFetching,
		refetch,
	} = useGetTrainingById(id, selected || "", {
		enabled: !!(selected && id),
	});

	const logQuery = useGetLogs({
		id,
		trainingId: training?.data.id,
		config: {
			enabled: !!id && !!training?.data.id,
		},
	});

	useEffect(() => {
		if (
			training?.data.status &&
			!["completed", "pending"].includes(training?.data.status)
		) {
			const timer = setTimeout(() => {
				refetch();
			}, 1000 * 15);
			return () => {
				clearTimeout(timer);
			};
		}
	}, [training?.data.status, refetch]);

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
			<div className="flex flex-col max-w-2xs">
				<InfiniteCombobox
					hook={trainingQuery}
					keyExtractor={(training) => String(training.id)}
					itemFetchHook={trainingIdQuery}
					fetchItemById={setTrainingToFetch}
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
			{training?.data.status &&
				!["training", "completed"].includes(training?.data.status) && (
					<div className="flex-1 h-full w-full flex justify-center items-center text-gray-500">
						This version is still in preparation stage, please wait.
					</div>
				)}
			{training?.data.status === "training" ? (
				<InfiniteLog queryHook={logQuery} trainingId={training?.data.id} />
			) : null}
			{training?.data.status === "completed" ? (
				<Tabs defaultValue="table" className="flex-1 w-full">
					<TabsList>
						<TabsTrigger value="table">Table Result</TabsTrigger>
						<TabsTrigger value="chart">Chart Visualization</TabsTrigger>
						<TabsTrigger value="image">Image</TabsTrigger>
					</TabsList>
					<TabsContent value="table" className="pt-6">
						{evaluateTable ? (
							<TableStatic
								data={evaluateTable.data}
								columns={evaluateTable.columns}
								bordered
								fullWidth
								keyField={id}
								className="-mt-10"
							/>
						) : (
							<RenderStatusAlert status={trainingFetching}>
								<div className="text-center py-8 text-muted-foreground border rounded-md border-gray-200">
									No evaluation result found
								</div>
							</RenderStatusAlert>
						)}
					</TabsContent>
					<TabsContent value="chart" className="pt-6">
						{training?.data.evaluation ? (
							<ModelEvaluationDashboard
								initialData={training?.data.evaluation}
							/>
						) : (
							<RenderStatusAlert status={trainingFetching}>
								<div className="flex border rounded-xl border-gray-200 border-dashed text-gray-400 justify-center items-center w-full h-96">
									no evaluation result found
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
			) : null}
		</>
	);
};
