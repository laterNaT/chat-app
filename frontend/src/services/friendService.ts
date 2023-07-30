import createClient from "openapi-fetch";
import { paths } from "../types/v1";

const { GET, POST } = createClient<paths>({
  baseUrl: "http://localhost:5000",
});

export function getFriends() {
  return GET("/api/friends/user", {
    credentials: "include",
  });
}

export function getFriendRequests() {
  return GET("/api/friends/requests/pending", {
    credentials: "include",
  });
}

export function getUsersNotFriended({ username }: { username: string }) {
  return GET("/api/friends/not-friended/{username}", {
    params: {
      path: {
        username,
      },
    },
    credentials: "include",
  });
}

export function sendFriendRequest({ username }: { username: string }) {
  return POST("/api/friends/requests/send", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      username,
    },
  });
}

export function acceptFriendRequest({ username }: { username: string }) {
  return POST("/api/friends/requests/accept", {
    credentials: "include",
    body: {
      username,
    },
  });
}

export function declineFriendRequest({ id }: { id: string }) {
  return POST("/api/friends/requests/decline", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      id,
    },
  });
}
