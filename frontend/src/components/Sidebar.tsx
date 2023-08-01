import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.scss";
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
    <div className="sidebar">
      <div className="conversations">
        <h2>Conversations</h2>
        <ul>
          {conversations.map((conversation) => (
            <ConversationSidebar {...conversation} key={conversation._id} />
          ))}
        </ul>
      </div>
      <div className="button-group">
        <button
          className="button manage-friends-button"
          onClick={manageFriends}
        >
          Manage friends
        </button>
        <button
          className="button new-conversation-button"
          onClick={newConversation}
        >
          New conversation
        </button>
      </div>
    </div>
  );
}
