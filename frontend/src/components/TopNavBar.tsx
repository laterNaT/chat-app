import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../backend/src/types/my_types/sockets";
import { useAuthentication } from "../context/AuthenticationContext";

export default function TopNavBar({
  socket,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}) {
  const { handleLogout } = useAuthentication();

  const logout = async () => {
    try {
      await handleLogout();
      socket.disconnect();
    } catch (err) {
      console.error("error: ", err);
    }
  };

  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Nav className="mx-auto">
        <Nav.Item>
          <Nav.Link as={Link} to="/home">
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/home/profile">
            Profile
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Nav className="ml-auto ">
        <Nav.Item>
          <button
            className="nav-link logout-button"
            onClick={() => void logout()}
          >
            Logout
          </button>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}
