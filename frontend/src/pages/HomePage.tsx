import { Outlet, useLoaderData } from "react-router-dom";
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

export default function HomePage() {
  const conversations = useLoaderData() as TConversations;

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
