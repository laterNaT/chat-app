import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import supertest from "supertest";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/my_types/sockets";
import { createApp, getMongoUrl } from "../utils/createApp";
import { createSockets } from "../utils/createSockets";

let io: Server<ClientToServerEvents, ServerToClientEvents>;
let { app, sessionMiddleware } = createApp();
let httpServer = createServer(app);

const user1 = {
  username: "test",
  password: "password",
};

let user2 = {
  username: "test2",
  password: "password",
};

beforeAll(async () => {
  io = createSockets(httpServer, sessionMiddleware);
  httpServer.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
  await mongoose.connect(getMongoUrl()!);
});

afterEach(async () => {
  await mongoose.connection.dropCollection("users");
  await mongoose.connection.createCollection("users");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  httpServer.close();
});

describe("user", () => {
  describe("register user", () => {
    describe("given a valid username and password", () => {
      it("should return status 201", async () => {
        const { statusCode } = await supertest(httpServer)
          .post("/api/users/register")
          .send(user1);
        expect(statusCode).toBe(201);
      });
    });

    describe("given an already existing username", () => {
      beforeEach(async () => {
        await supertest(httpServer).post("/api/users/register").send(user1);
      });

      it("should return status 400", async () => {
        const { statusCode } = await supertest(httpServer)
          .post("/api/users/register")
          .send(user1);
        expect(statusCode).toBe(400);
      });
    });

    describe("given no username", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(httpServer)
          .post("/api/users/register")
          .send({ password: "password" });
        expect(statusCode).toBe(400);
      });
    });

    describe("given no password", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(httpServer)
          .post("/api/users/register")
          .send({ username: "test" });
        expect(statusCode).toBe(400);
      });
    });

    describe("given no username and password", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(httpServer)
          .post("/api/users/register")
          .send({});
        expect(statusCode).toBe(400);
      });
    });

    describe("given a username with less than 3 characters", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(httpServer)
          .post("/api/users/register")
          .send({ username: "te", password: "password" });
        expect(statusCode).toBe(400);
      });
    });

    describe("given a password with less than 6 characters", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(httpServer)
          .post("/api/users/register")
          .send({ username: "test", password: "pass" });
        expect(statusCode).toBe(400);
      });
    });

    describe("given a username with more than 12 characters", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(httpServer)
          .post("/api/users/register")
          .send({
            username: "t".repeat(13),
            password: "password",
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("given already logged in", () => {
      let agent: supertest.SuperAgentTest;
      beforeEach(async () => {
        agent = supertest.agent(httpServer);
        await agent.post("/api/users/register").send(user1);
        await agent.post("/api/users/login").send(user1);
      });

      it("should return status 400", async () => {
        await agent.post("/api/users/login").send(user1);
        const { statusCode } = await agent
          .post("/api/users/register")
          .send(user1);
        expect(statusCode).toBe(400);
      });
    });

    describe("given already logged out", () => {
      let agent: supertest.SuperAgentTest;
      beforeEach(async () => {
        agent = supertest.agent(httpServer);
        await agent.post("/api/users/register").send(user1);
        await agent.post("/api/users/login").send(user1);
        await agent.delete("/api/users/logout");
      });

      it("should return status 400", async () => {
        const { statusCode } = await agent
          .post("/api/users/register")
          .send(user1);
        expect(statusCode).toBe(400);
      });
    });
  });

  describe("login user", () => {
    let agent: supertest.SuperAgentTest;
    beforeEach(async () => {
      agent = supertest.agent(httpServer);
      await agent.post("/api/users/register").send(user1);
    });
    afterEach(async () => {
      await agent.delete("/api/users/logout");
    });

    describe("given a valid username and password", () => {
      it("should return status 200", async () => {
        const agent = supertest.agent(httpServer);
        const { statusCode } = await agent.post("/api/users/login").send(user1);
        expect(statusCode).toBe(200);
      });
    });

    describe("given an invalid username", () => {
      it("should return status 400", async () => {
        const { statusCode } = await agent
          .post("/api/users/login")
          .send({ username: "invalid", password: "password" });
        expect(statusCode).toBe(400);
      });
    });

    describe("given an invalid password", () => {
      it("should return status 400", async () => {
        const { statusCode } = await agent
          .post("/api/users/login")
          .send({ username: "test", password: "invalid" });
        expect(statusCode).toBe(400);
      });
    });

    describe("given no username", () => {
      it("should return status 400", async () => {
        const { statusCode } = await agent
          .post("/api/users/login")
          .send({ password: "password" });
        expect(statusCode).toBe(400);
      });
    });

    describe("given no password", () => {
      it("should return status 400", async () => {
        const { statusCode } = await agent
          .post("/api/users/login")
          .send({ username: "test" });
        expect(statusCode).toBe(400);
      });
    });
  });
  describe("logout user", () => {
    describe("given logged in", () => {
      let agent: supertest.SuperAgentTest;
      beforeEach(async () => {
        agent = supertest.agent(httpServer);
        await agent.post("/api/users/register").send(user1);
        await agent.post("/api/users/login").send(user1);
      });

      it("should return status 200", async () => {
        const { statusCode } = await agent.delete("/api/users/logout");
        expect(statusCode).toBe(200);
      });
    });

    describe("given logged out", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(httpServer).delete(
          "/api/users/logout",
        );
        expect(statusCode).toBe(400);
      });
    });
  });
  describe("search users", () => {
    let agent: supertest.SuperAgentTest;
    beforeEach(async () => {
      agent = supertest.agent(httpServer);
      await agent.post("/api/users/register").send(user1);
      await agent.post("/api/users/login").send(user1);
    });

    describe("given a valid username", () => {
      beforeEach(async () => {
        const agent2 = supertest.agent(httpServer);
        await agent2.post("/api/users/register").send(user2);
      });

      it("should return status 200", async () => {
        const { statusCode } = await agent.get("/api/users/search/test2");
        expect(statusCode).toBe(200);
      });

      it("should return an array of users", async () => {
        const { body } = await agent.get("/api/users/search/test2");
        expect(body).toEqual(
          expect.objectContaining({
            users: expect.arrayContaining([
              expect.objectContaining({
                username: "test2",
              }),
            ]),
          }),
        );
      });
    });

    describe("given an invalid username", () => {
      it("should return status 200", async () => {
        const { statusCode } = await agent.get("/api/users/search/invalid");
        expect(statusCode).toBe(200);
      });

      it("should return an empty array", async () => {
        const { statusCode, body } = await agent.get(
          "/api/users/search/invalid",
        );
        expect(body).toEqual(expect.arrayContaining([]));
      });
    });
  });
});
