type PipelineStep = {
	name: string;
	index: number;
};

export type Pipeline = {
	current: string;
	steps: PipelineStep[];
};

export type TrainingPipeline = {
	version?: string;
	pipeline: Pipeline;
};
