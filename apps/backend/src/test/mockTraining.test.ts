import { describe, expect, test } from "bun:test";
import { mockTrainingController } from "@/applications/controllers/mockTrainingController";

describe("Mock Training Controller", () => {
	test("POST /mock/train initiates training", async () => {
		const mockData = {
			modelId: "test-model-1",
			datasetId: "test-dataset-1",
		};

		const response = await mockTrainingController.handle(
			new Request("http://localhost/mock/train", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(mockData),
			}),
		);

		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toHaveProperty("message");
		expect(data.message).toBe("Training Completed");
	});
});
