import { useNavigate } from "react-router-dom";
import { TConversation } from "../pages/HomePage";
import "../styles/Sidebar.scss";

export default function Sidebar({
  conversations,
}: {
  conversations: TConversation[];
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
            <li key={conversation._id}>{conversation.conversationName}</li>
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
