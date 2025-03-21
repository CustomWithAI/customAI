import { describe, expect, test } from "bun:test";
import { enumController } from "@/applications/controllers/enumController";

describe("Enum Controller", () => {
	test("GET /enum returns enum data", async () => {
		const response = await enumController.handle(
			new Request("http://localhost/enum"),
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toBeDefined();
		expect(typeof data).toBe("object");
	});
});
