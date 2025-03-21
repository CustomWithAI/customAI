import { describe, expect, test } from "bun:test";
import { Elysia } from "elysia";

const app = new Elysia()
	.get("/", () => "CustomAI API")
	.get("/route-count", () => ({ routes: 1, length: 1 }));

describe("API Endpoints", () => {
	test("GET / returns CustomAI API", async () => {
		const response = await app.handle(new Request("http://localhost/"));
		const text = await response.text();
		expect(text).toBe("CustomAI API");
	});

	test("GET /route-count returns route information", async () => {
		const response = await app.handle(
			new Request("http://localhost/route-count"),
		);
		const json = await response.json();
		expect(json).toHaveProperty("routes");
		expect(json).toHaveProperty("length");
	});
});
