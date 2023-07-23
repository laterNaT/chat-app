import { Link } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <h1>Welcome to chat-app</h1>
      <p>
        In this app you chat chat privatly with your friends or speak with
        strangers in global chat rooms.
      </p>
      <Link to="/login" style={{ textDecoration: "none" }}>
        Continue
      </Link>
    </div>
  );
}
