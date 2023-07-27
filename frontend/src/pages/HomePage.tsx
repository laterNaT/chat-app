import { Outlet, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";

type Message = {
  message: string;
  from: string;
  timestamp: number;
};

type Participant = {
  name: string;
};

export type TConversation = {
  conversationID: number;
  conversationName: string;
  messages: Message[];
  participants: Participant[];
};

export async function loader() {
  const data: TConversation = {
    conversationID: 1,
    conversationName: "bob and alice",
    messages: [
      {
        message: "Hello",
        from: "bob",
        timestamp: 123456789,
      },
      {
        message: "Hi",
        from: "alice",
        timestamp: 123456789,
      },
    ],
    participants: [
      {
        name: "bob",
      },
      {
        name: "alice",
      },
    ],
  };
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return data;
}

export default function HomePage() {
  const res = useLoaderData() as TConversation;
  const conversations = [res]; // NOTE: useLoaderData will return list when hooked up to backend
  return (
    <>
      <TopNavBar />
      <div style={{ display: "flex" }}>
        <Sidebar conversations={conversations} />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "3rem",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
