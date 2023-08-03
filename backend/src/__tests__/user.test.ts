import mongoose from "mongoose";
import supertest from "supertest";
import { createApp, getMongoUrl } from "../utils/createApp";

const { app } = createApp();

beforeAll(async () => {
  await mongoose.connect(getMongoUrl()!);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe("user", () => {
  describe("register user", () => {
    describe("given a valid username and password", () => {
      it("should return status 200", async () => {
        const { statusCode } = await supertest(app)
          .post("/api/users/register")
          .send({
            username: "test",
            password: "password",
          });
        expect(statusCode).toBe(201);
      });
    });
    describe("given an already existing username", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(app)
          .post("/api/users/register")
          .send({
            username: "test",
            password: "password",
          });
        expect(statusCode).toBe(400);
      });
    });
  });
});
