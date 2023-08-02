import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { paths } from "../types/v1";
import ConversationSidebar from "./ConversationSidebar";

export type TConversations =
  paths["/api/conversations/"]["get"]["responses"]["200"]["content"]["application/json"]["conversations"];

export default function Sidebar({
  conversations,
}: {
  conversations: TConversations;
}) {
  const navigate = useNavigate();

  // manage friends click handler
  const manageFriends = () => {
    navigate("/home/manage-friends");
  };

  const newConversation = () => {
    navigate("/home/new-conversation");
  };

  return (
    <div className="px-2 d-flex flex-column justify-content-between pb-4 bg-light ">
      <h2>Conversations</h2>
      <div className="d-flex flex-column gap-2">
        {conversations.map((conversation, index) => (
          <ConversationSidebar key={index} {...conversation} />
        ))}
      </div>
      <div className="d-flex flex-column gap-2 mt-4">
        <Button variant="primary" onClick={manageFriends}>
          Manage friends
        </Button>
        <Button variant="primary" onClick={newConversation}>
          New conversation
        </Button>
      </div>
    </div>
  );
}
