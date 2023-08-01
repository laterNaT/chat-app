import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../backend/src/types/my_types/sockets";
import { useAuthentication } from "../context/AuthenticationContext";
import "../styles/TopNavBar.scss";

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
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/home" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/home/profile" className="nav-link">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <button
            className="nav-link logout-button"
            onClick={() => void logout()}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
