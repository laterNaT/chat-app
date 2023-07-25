import { Link } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationContext";
import "../styles/TopNavBar.scss";

export default function TopNavBar() {
  const { handleLogout } = useAuthentication();

  const logout = async () => {
    try {
      await handleLogout();
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
