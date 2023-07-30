import createClient from "openapi-fetch";
import { paths } from "../types/v1";

const { GET } = createClient<paths>({
  baseUrl: "http://localhost:5000",
});

// get all users using GET func. above to /api/users/search with params: username
export function getUsers({ username }: { username: string }) {
  return GET("/api/users/search/{username}", {
    params: {
      path: {
        username,
      },
    },
    credentials: "include",
  });
}
