import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { workflow } from "@/applications/controllers/workflowController";
import { auth } from "@/lib/auth";
import { Elysia } from "elysia";

const mockSession = {
	id: "test-session-1",
	token: "test-token",
	userId: "test-user-1",
	createdAt: new Date(),
	updatedAt: new Date(),
	expiresAt: new Date(),
	ipAddress: "127.0.0.1",
	userAgent: "test-agent",
	impersonatedBy: null,
};

const mockUser = {
	id: "test-user-1",
	email: "test@example.com",
	name: "Test User",
	createdAt: new Date(),
	updatedAt: new Date(),
};

// Mock the auth library
const originalGetSession = auth.api.getSession;

beforeAll(() => {
	auth.api.getSession = (async () => ({
		session: {
			id: mockSession.id,
			createdAt: mockSession.createdAt,
			updatedAt: mockSession.updatedAt,
			userId: mockSession.userId,
			expiresAt: mockSession.expiresAt,
			token: mockSession.token,
		},
		user: {
			id: mockUser.id,
			email: mockUser.email,
			name: mockUser.name,
			createdAt: mockUser.createdAt,
			updatedAt: mockUser.updatedAt,
		},
	})) as any;
});

afterAll(() => {
	auth.api.getSession = originalGetSession;
});

// Mock the services
const mockWorkflowService = {
	createWorkflow: async (data: { userId: string }) => ({
		id: "test-workflow-1",
		...data,
		name: "Test Workflow",
		description: "Test Description",
		type: "custom",
		createdAt: new Date(),
		updatedAt: new Date(),
	}),
	getWorkflowsByUserId: async (userId: string, query: { limit: number }) => ({
		data: [
			{
				id: "test-workflow-1",
				name: "Test Workflow",
				description: "Test Description",
				type: "custom",
				userId: "test-user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		],
		nextCursor: undefined,
		prevCursor: undefined,
		total: 1,
	}),
	getWorkflowById: async () => ({
		id: "test-workflow-1",
		name: "Test Workflow",
		description: "Test Description",
		type: "custom",
		userId: "test-user-1",
		createdAt: new Date(),
		updatedAt: new Date(),
	}),
	updateWorkflow: async (
		userId: string,
		workflowId: string,
		data: { name: string; description: string },
	) => ({
		id: workflowId,
		...data,
		userId,
		type: "custom",
		createdAt: new Date(),
		updatedAt: new Date(),
	}),
	deleteWorkflow: async (userId: string, workflowId: string) => ({
		id: workflowId,
		name: "Test Workflow",
		description: "Test Description",
		type: "custom",
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
	}),
};

const mockTrainingService = {
	createTraining: async () => ({
		id: "test-training-1",
		pipeline: {
			steps: ["preprocess", "train"],
		},
		version: null,
		hyperparameter: null,
		status: "created",
		queueId: null,
		retryCount: 0,
		errorMessage: null,
		trainedModelPath: null,
		workflowId: "test-workflow-1",
		datasetId: null,
		imagePreprocessingId: null,
		featureExtractionId: null,
		featureSelectionId: null,
		augmentationId: null,
		preTrainedModel: null,
		machineLearningModel: null,
		customModelId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		isDefault: false,
	}),
	getTrainingsByWorkflowId: async () => ({
		data: [
			{
				id: "test-training-1",
				pipeline: {
					steps: ["preprocess", "train"],
				},
				version: null,
				hyperparameter: null,
				status: "created",
				queueId: null,
				retryCount: 0,
				errorMessage: null,
				trainedModelPath: null,
				dataset: null,
				imagePreprocessing: null,
				featureExtraction: null,
				featureSelection: null,
				augmentation: null,
				workflow: {
					id: "test-workflow-1",
					name: "Test Workflow",
					description: "Test Description",
					type: "custom",
					userId: "test-user-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				preTrainedModel: null,
				machineLearningModel: null,
				customModel: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				isDefault: false,
			},
		],
		nextCursor: undefined,
		prevCursor: undefined,
		total: 1,
	}),
	getTrainingById: async () => ({
		id: "test-training-1",
		pipeline: {
			steps: ["preprocess", "train"],
		},
		version: null,
		hyperparameter: null,
		status: "created",
		queueId: null,
		retryCount: 0,
		errorMessage: null,
		trainedModelPath: null,
		dataset: null,
		imagePreprocessing: null,
		featureExtraction: null,
		featureSelection: null,
		augmentation: null,
		workflow: {
			id: "test-workflow-1",
			name: "Test Workflow",
			description: "Test Description",
			type: "custom",
			userId: "test-user-1",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		preTrainedModel: null,
		machineLearningModel: null,
		customModel: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		isDefault: false,
	}),
	updateTraining: async () => ({
		id: "test-training-1",
		pipeline: {
			steps: ["preprocess", "train"],
		},
		version: null,
		hyperparameter: null,
		status: "created",
		queueId: null,
		retryCount: 0,
		errorMessage: null,
		trainedModelPath: null,
		workflowId: "test-workflow-1",
		datasetId: null,
		imagePreprocessingId: null,
		featureExtractionId: null,
		featureSelectionId: null,
		augmentationId: null,
		preTrainedModel: null,
		machineLearningModel: null,
		customModelId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		isDefault: false,
	}),
	deleteTraining: async () => ({
		id: "test-training-1",
		pipeline: {
			steps: ["preprocess", "train"],
		},
		version: null,
		hyperparameter: null,
		status: "created",
		queueId: null,
		retryCount: 0,
		errorMessage: null,
		trainedModelPath: null,
		workflowId: "test-workflow-1",
		datasetId: null,
		imagePreprocessingId: null,
		featureExtractionId: null,
		featureSelectionId: null,
		augmentationId: null,
		preTrainedModel: null,
		machineLearningModel: null,
		customModelId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		isDefault: false,
	}),
	startTraining: async () => ({
		message: "Training started",
		queueId: "test-queue-1",
	}),
	setTrainingToDefault: async () => ({
		id: "test-training-1",
		pipeline: {
			steps: ["preprocess", "train"],
		},
		version: null,
		hyperparameter: null,
		status: "created",
		queueId: null,
		retryCount: 0,
		errorMessage: null,
		trainedModelPath: null,
		workflowId: "test-workflow-1",
		datasetId: null,
		imagePreprocessingId: null,
		featureExtractionId: null,
		featureSelectionId: null,
		augmentationId: null,
		preTrainedModel: null,
		machineLearningModel: null,
		customModelId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		isDefault: true,
	}),
	getTrainingByDefault: async () => ({
		id: "test-training-1",
		pipeline: {
			steps: ["preprocess", "train"],
		},
		version: null,
		hyperparameter: null,
		status: "created",
		queueId: null,
		retryCount: 0,
		errorMessage: null,
		trainedModelPath: null,
		dataset: null,
		imagePreprocessing: null,
		featureExtraction: null,
		featureSelection: null,
		augmentation: null,
		workflow: {
			id: "test-workflow-1",
			name: "Test Workflow",
			description: "Test Description",
			type: "custom",
			userId: "test-user-1",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		preTrainedModel: null,
		machineLearningModel: null,
		customModel: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		isDefault: true,
	}),
};

// Create the test app
const app = new Elysia()
	.decorate("workflowService", mockWorkflowService)
	.decorate("trainingService", mockTrainingService)
	.use(workflow);

describe("Workflow Controller", () => {
	test("POST /api/v1/workflows/:workflowId/trainings", async () => {
		const response = await app.handle(
			new Request(
				"http://localhost/api/v1/workflows/test-workflow-1/trainings",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${mockSession.token}`,
					},
				},
			),
		);

		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toHaveProperty("pipeline");
		expect(json.pipeline).toHaveProperty("steps");
		expect(json.workflowId).toBe("test-workflow-1");
	});

	test("GET /api/v1/workflows/:workflowId/trainings", async () => {
		const response = await app.handle(
			new Request(
				"http://localhost/api/v1/workflows/test-workflow-1/trainings",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${mockSession.token}`,
					},
				},
			),
		);

		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toHaveProperty("data");
		expect(json.data[0]).toHaveProperty("pipeline");
		expect(json.data[0].pipeline).toHaveProperty("steps");
		expect(json.data[0].workflow.id).toBe("test-workflow-1");
	});

	test("GET /api/v1/workflows/:workflowId/trainings/:trainingId", async () => {
		const response = await app.handle(
			new Request(
				"http://localhost/api/v1/workflows/test-workflow-1/trainings/test-training-1",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${mockSession.token}`,
					},
				},
			),
		);

		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toHaveProperty("pipeline");
		expect(json.pipeline).toHaveProperty("steps");
		expect(json.workflow.id).toBe("test-workflow-1");
	});

	test("PUT /api/v1/workflows/:workflowId/trainings/:trainingId", async () => {
		const response = await app.handle(
			new Request(
				"http://localhost/api/v1/workflows/test-workflow-1/trainings/test-training-1",
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${mockSession.token}`,
					},
				},
			),
		);

		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toHaveProperty("pipeline");
		expect(json.pipeline).toHaveProperty("steps");
		expect(json.workflowId).toBe("test-workflow-1");
	});

	test("DELETE /api/v1/workflows/:workflowId/trainings/:trainingId", async () => {
		const response = await app.handle(
			new Request(
				"http://localhost/api/v1/workflows/test-workflow-1/trainings/test-training-1",
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${mockSession.token}`,
					},
				},
			),
		);

		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toHaveProperty("pipeline");
		expect(json.pipeline).toHaveProperty("steps");
		expect(json.workflowId).toBe("test-workflow-1");
	});

	test("POST /api/v1/workflows/:workflowId/trainings/:trainingId/start", async () => {
		const response = await app.handle(
			new Request(
				"http://localhost/api/v1/workflows/test-workflow-1/trainings/test-training-1/start",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${mockSession.token}`,
					},
				},
			),
		);

		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toHaveProperty("message");
		expect(json).toHaveProperty("queueId");
	});

	test("PUT /api/v1/workflows/:workflowId/trainings/:trainingId/default", async () => {
		const response = await app.handle(
			new Request(
				"http://localhost/api/v1/workflows/test-workflow-1/trainings/test-training-1/default",
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${mockSession.token}`,
					},
				},
			),
		);

		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toHaveProperty("pipeline");
		expect(json.pipeline).toHaveProperty("steps");
		expect(json.workflowId).toBe("test-workflow-1");
		expect(json.isDefault).toBe(true);
	});

	test("GET /api/v1/workflows/:workflowId/trainings/default", async () => {
		const response = await app.handle(
			new Request(
				"http://localhost/api/v1/workflows/test-workflow-1/trainings/default",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${mockSession.token}`,
					},
				},
			),
		);

		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toHaveProperty("pipeline");
		expect(json.pipeline).toHaveProperty("steps");
		expect(json.workflow.id).toBe("test-workflow-1");
		expect(json.isDefault).toBe(true);
	});
});
