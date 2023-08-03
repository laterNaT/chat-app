import { Card } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { TConversations } from "./Sidebar";
type ConversationProps = TConversations[number];

export default function ConversationSidebar({
  _id,
  conversationName,
}: ConversationProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/home/conversations/${_id}`);
  };

  return (
    <Card className="conversation-sidebar" onClick={handleClick}>
      <Card.Body>
        <NavLink
          to={`/home/conversations/${_id}`}
          className={({ isActive, isPending }) =>
            isPending
              ? "text-info"
              : isActive
              ? "text-primary"
              : "text-secondary"
          }
        >
          {conversationName}
        </NavLink>
      </Card.Body>
    </Card>
  );
}
