import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
    <Card className="conversation-sidebar" onClick={handleClick}>
      <Card.Body>{conversationName}</Card.Body>
    </Card>
  );
}
