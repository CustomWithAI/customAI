import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { dataset } from "@/applications/controllers/datasetController";
import type { CreateDatasetDto } from "@/domains/dtos/dataset";
import {
	createDatasetDto,
	datasetResponseDto,
	datasetsResponseDto,
	updateDatasetDto,
} from "@/domains/dtos/dataset";
import { paginationDto } from "@/domains/dtos/pagination";
import { auth } from "@/lib/auth";
import { Elysia } from "elysia";

const mockUser = {
	id: "test-user-1",
	email: "test@example.com",
	name: "Test User",
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockSession = {
	id: "test-session-1",
	userId: mockUser.id,
	createdAt: new Date(),
	updatedAt: new Date(),
	expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
	token: "mock-token",
	ipAddress: "127.0.0.1",
	userAgent: "test-agent",
	impersonatedBy: null,
};

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
const mockDatasetService = {
	createDataset: async (data: CreateDatasetDto & { userId: string }) => ({
		id: "test-dataset-1",
		...data,
		createdAt: new Date(),
		updatedAt: new Date(),
		userId: data.userId,
		splitMethod: null,
		labels: null,
		train: null,
		test: null,
		valid: null,
		images: [],
		imageCount: 0,
	}),
	getDatasetsByUserId: async (userId: string, query: { limit: number }) => ({
		data: [
			{
				id: "test-dataset-1",
				name: "Test Dataset",
				description: "Test Description",
				annotationMethod: "manual",
				userId: "test-user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
				splitMethod: null,
				labels: null,
				train: null,
				test: null,
				valid: null,
				images: [],
				imageCount: 0,
			},
		],
		nextCursor: undefined,
		prevCursor: undefined,
		total: 1,
	}),
	getDatasetById: async () => ({
		id: "test-dataset-1",
		name: "Test Dataset",
		description: "Test Description",
		annotationMethod: "manual",
		userId: "test-user-1",
		createdAt: new Date(),
		updatedAt: new Date(),
		splitMethod: null,
		labels: null,
		train: null,
		test: null,
		valid: null,
		images: [],
		imageCount: 0,
	}),
	updateDataset: async (
		userId: string,
		datasetId: string,
		data: CreateDatasetDto,
	) => ({
		id: datasetId,
		...data,
		annotationMethod: "manual",
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
		splitMethod: null,
		labels: null,
		train: null,
		test: null,
		valid: null,
		images: [],
		imageCount: 0,
	}),
	deleteDataset: async (userId: string, datasetId: string) => ({
		id: datasetId,
		name: "Test Dataset",
		description: "Test Description",
		annotationMethod: "manual",
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
		splitMethod: null,
		labels: null,
		train: null,
		test: null,
		valid: null,
		images: [],
		imageCount: 0,
	}),
};

// Mock the image service
const mockImageService = {
	uploadImages: async () => [],
	getImagesByDatasetId: async () => ({
		data: [],
		meta: { total: 0, page: 1, limit: 10 },
	}),
	getImageByPath: async () => ({}),
	updateImage: async () => ({}),
	deleteImage: async () => ({ success: true }),
};

// Create a new instance of the dataset controller for testing
const testDataset = new Elysia()
	.decorate("datasetService", mockDatasetService)
	.decorate("imageService", mockImageService)
	.use(dataset);

describe("Dataset Controller", () => {
	const mockDatasetData = {
		name: "Test Dataset",
		description: "Test Description",
		annotationMethod: "manual",
	};

	const mockHeaders = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${mockSession.token}`,
	};

	test("POST / creates a new dataset", async () => {
		const response = await testDataset.handle(
			new Request("http://localhost/datasets", {
				method: "POST",
				headers: mockHeaders,
				body: JSON.stringify(mockDatasetData),
			}),
		);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty("id");
		expect(data.name).toBe(mockDatasetData.name);
	});

	test("GET / lists datasets", async () => {
		const response = await testDataset.handle(
			new Request("http://localhost/datasets?limit=10", {
				headers: mockHeaders,
			}),
		);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty("data");
		expect(Array.isArray(data.data)).toBe(true);
	});

	test("GET /:id retrieves a dataset", async () => {
		const response = await testDataset.handle(
			new Request("http://localhost/datasets/test-dataset-1", {
				headers: mockHeaders,
			}),
		);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty("id");
		expect(data).toHaveProperty("name");
	});

	test("PUT /:id updates a dataset", async () => {
		const updateData = {
			name: "Updated Dataset",
			description: "Updated Description",
			annotationMethod: "manual",
		};

		const response = await testDataset.handle(
			new Request("http://localhost/datasets/test-dataset-1", {
				method: "PUT",
				headers: mockHeaders,
				body: JSON.stringify(updateData),
			}),
		);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data.name).toBe(updateData.name);
	});

	test("DELETE /:id deletes a dataset", async () => {
		const response = await testDataset.handle(
			new Request("http://localhost/datasets/test-dataset-1", {
				method: "DELETE",
				headers: mockHeaders,
			}),
		);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty("id");
		expect(data).toHaveProperty("name");
	});
});
