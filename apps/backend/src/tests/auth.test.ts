import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "@/index.js";

async function createUser() {
	return await request(app).post("/users").send({
		username: "testuser",
		email: "test@test.com",
		name: "Test User",
		age: 25,
		password: "password123",
	});
}

describe("Auth Tests", () => {
	describe("Login Tests", () => {
		// create user
		beforeAll(createUser);

		it("should fail login without password", async () => {
			const response = await request(app).post("/auth/login").send({
				username: "testuser",
			});
			expect(response.status).toBe(400);
		});

		it("should fail login without username", async () => {
			const response = await request(app).post("/auth/login").send({
				password: "password123",
			});
			expect(response.status).toBe(400);
		});

		it("should fail login with incorrect credentials", async () => {
			const response = await request(app).post("/auth/login").send({
				username: "testuser",
				password: "wrongpassword",
			});
			expect(response.status).toBe(401);
		});

		it("should login successfully with correct credentials", async () => {
			const response = await request(app).post("/auth/login").send({
				username: "testuser",
				password: "password123",
			});
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("token");
			expect(response.headers["set-cookie"]).toBeDefined();
		});
	});

	describe("Logout Tests", () => {
		it("should logout successfully", async () => {
			const agent = request.agent(app);
			await agent.post("/auth/login").send({
				username: "testuser",
				password: "password123",
			});

			const response = await agent.post("/auth/logout").send();
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty(
				"message",
				"Logged out successfully",
			);
		});
	});

	describe("Refresh Token Tests", () => {
		it("should fail refresh without refresh token", async () => {
			const response = await request(app).post("/auth/refresh").send();
			expect(response.status).toBe(401);
		});

		it("should refresh token successfully with valid refresh token", async () => {
			const agent = request.agent(app);
			const loginResponse = await agent.post("/auth/login").send({
				username: "testuser",
				password: "password123",
			});
			expect(loginResponse.status).toBe(200);
			expect(loginResponse.headers["set-cookie"]).toBeDefined();

			const response = await agent.post("/auth/refresh").send();
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("token");
		});
	});
});

afterAll(async () => {
	// await request(app).delete("/users/testuser");
});
