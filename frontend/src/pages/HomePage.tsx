import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Socket } from "socket.io-client";
import Sidebar, { TConversations } from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import { getConversations } from "../services/conversationService";

export async function loader() {
  try {
    const res = await getConversations();
    return res.conversations;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default function HomePage({ socket }: { socket: Socket }) {
  const conversations = useLoaderData() as TConversations;

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <>
      <TopNavBar socket={socket} />
      <div style={{ display: "flex" }}>
        <Sidebar conversations={conversations} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
            margin: "16px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
