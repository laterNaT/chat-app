import createClient from "openapi-fetch";
import { paths } from "../types/v1";

const { GET, POST } = createClient<paths>({
  baseUrl: "http://localhost:5000",
});

const createConversation = async ({
  conversationName,
  participants,
}: {
  conversationName: string;
  participants: string[];
}) => {
  try {
    if (!conversationName || !participants) {
      throw new Error("No name or members");
    }
    const { data, error } = await POST("/api/conversations/create", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        conversationName,
        participants,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getConversations = async () => {
  try {
    const { data, error } = await GET("/api/conversations/", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Could not get conversations");
  }
};

export { createConversation, getConversations };
