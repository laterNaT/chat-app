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
  user: {
    username: "test",
    password: "password",
  },
  agent: supertest.agent(httpServer),
};

const user2 = {
  user: {
    username: "test2",
    password: "password",
  },
  agent: supertest.agent(httpServer),
};

async function clearDatabase() {
  const collections = Object.keys(mongoose.connection.collections);

  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    if (collectionName !== "sessions") {
      await collection.deleteMany();
    }
  }
}

beforeAll(async () => {
  io = createSockets(httpServer, sessionMiddleware);
  httpServer.listen(5000);
  await mongoose.connect(getMongoUrl()!);
});

beforeEach(async () => {
  user1.agent = supertest.agent(httpServer); // IMPORTANT
  user2.agent = supertest.agent(httpServer); // IMPORTANT
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  httpServer.close();
  await mongoose.connection.close();
});

describe("friend", () => {
  describe("send friend request", () => {
    beforeEach(async () => {
      await user1.agent.post("/api/users/register").send(user1.user);
      await user2.agent.post("/api/users/register").send(user2.user);
      await user1.agent.post("/api/users/login").send(user1.user);
      await user2.agent.post("/api/users/login").send(user2.user);
    });

    afterEach(async () => {
      await user1.agent.post("/api/users/logout");
    });

    describe("to a user that exists and is not already friends", () => {
      it("should return status 200", async () => {
        const { statusCode } = await user1.agent
          .post("/api/friends/requests/send")
          .send({
            username: user2.user.username,
          });
        expect(statusCode).toBe(200);
      });
    });

    describe("to a user that does not exist", () => {
      it("should return status 400", async () => {
        const { statusCode } = await user1.agent
          .post("/api/friends/requests/send")
          .send({
            username: "doesnotexist",
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("to a user that is already friends", () => {
      beforeEach(async () => {
        await user1.agent.post("/api/friends/requests/send").send({
          username: user2.user.username,
        });
        await user2.agent.post("/api/friends/requests/accept").send({
          username: user1.user.username,
        });
      });
      it("should return status 400", async () => {
        const { statusCode } = await user1.agent
          .post("/api/friends/requests/send")
          .send({
            username: user2.user.username,
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("to a user that has already sent a friend request to us", () => {
      beforeEach(async () => {
        await user1.agent.post("/api/friends/requests/send").send({
          username: user2.user.username,
        });
      });
      it("should return status 400", async () => {
        const { statusCode, body } = await user2.agent
          .post("/api/friends/requests/send")
          .send({
            username: user1.user.username,
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("to a user that we have already sent a friend request to", () => {
      beforeEach(async () => {
        await user1.agent.post("/api/friends/requests/send").send({
          username: user2.user.username,
        });
      });
      it("should return status 400", async () => {
        const { statusCode } = await user1.agent
          .post("/api/friends/requests/send")
          .send({
            username: user2.user.username,
          });
        expect(statusCode).toBe(400);
      });
    });
  });
  describe("accept friend request", () => {
    beforeEach(async () => {
      await user1.agent.post("/api/users/register").send(user1.user);
      await user2.agent.post("/api/users/register").send(user2.user);
      await user1.agent.post("/api/users/login").send(user1.user);
      await user2.agent.post("/api/users/login").send(user2.user);
    });

    afterEach(async () => {
      await user1.agent.post("/api/users/logout");
    });

    describe("from a user that exists and has sent us a friend request", () => {
      beforeEach(async () => {
        await user1.agent.post("/api/friends/requests/send").send({
          username: user2.user.username,
        });
      });
      it("should return status 200", async () => {
        const { statusCode } = await user2.agent
          .post("/api/friends/requests/accept")
          .send({
            username: user1.user.username,
          });
        expect(statusCode).toBe(200);
      });
    });

    describe("from a user that does not exist", () => {
      it("should return status 400", async () => {
        const { statusCode } = await user1.agent
          .post("/api/friends/requests/accept")
          .send({
            username: "doesnotexist",
          });
        expect(statusCode).toBe(400);
      });
    });

    describe("from a user that is already friends", () => {
      beforeEach(async () => {
        await user1.agent.post("/api/friends/requests/send").send({
          username: user2.user.username,
        });
        await user2.agent.post("/api/friends/requests/accept").send({
          username: user1.user.username,
        });
      });
      it("should return status 400", async () => {
        const { statusCode } = await user2.agent
          .post("/api/friends/requests/accept")
          .send({
            username: user1.user.username,
          });
        expect(statusCode).toBe(400);
      });
    });
  });
});
