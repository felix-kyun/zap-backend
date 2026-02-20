import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "@/index.js";

describe("Test for non-existing routes", () => {
	it("should return 404 for a non-existing route", async () => {
		const response = await request(app).get("/non-existing-route");
		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message");
		expect((response.body as Record<string, unknown>).message).toContain(
			"Not Found",
		);
	});
});
