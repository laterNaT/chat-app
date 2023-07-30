import { Outlet, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import { getConversations } from "../services/conversationService";

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
  try {
    const res = await getConversations();
    return res.conversations;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default function HomePage() {
  const { conversations } = useLoaderData();
  console.log(conversations);
  console.log(conversations.conversations);
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
