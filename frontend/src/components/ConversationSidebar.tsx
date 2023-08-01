import { useNavigate } from "react-router-dom";
import "../styles/ConversationBtn.scss";
import { TConversations } from "./Sidebar";
type ConversationProps = TConversations[number];

export default function ConversationSidebar({
  _id,
  conversationName,
}: ConversationProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(_id);
    navigate(`/home/conversations/${_id}`);
  };

  return (
    <li onClick={handleClick} className="conversation-btn">
      {conversationName}
    </li>
  );
}
