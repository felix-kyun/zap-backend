import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "@/index.js";

describe("Test for debug mode", () => {
	it("should return 200 for /debug route in development mode", async () => {
		const response = await request(app).get("/debug/vars");
		expect(response.status).toBe(200);
	});

	it("should provide config variables in response", async () => {
		const response = await request(app).get("/debug/vars");
		expect(
			Object.keys(response.body as Record<string, unknown>).length,
		).toBeGreaterThan(0);
	});

	it("env should be set to 'test' during testing", async () => {
		const response = await request(app).get("/debug/vars");
		expect((response.body as Record<string, unknown>).ENV).toBe("test");
	});
});
