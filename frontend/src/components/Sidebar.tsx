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

  return (
    <div className="sidebar">
      <p>TODO: render list of conversations</p>
      <div className="button-group">
        <button
          className="button manage-friends-button"
          onClick={manageFriends}
        >
          Manage friends
        </button>
        <button className="button new-conversation-button">
          New conversation
        </button>
      </div>
    </div>
  );
}
