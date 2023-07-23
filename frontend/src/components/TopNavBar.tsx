import { Link } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationContext";

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
    <ul
      style={{
        display: "flex",
        listStyle: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          gap: 20,
        }}
      >
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/home/profile">Profile</Link>
        </li>
      </div>
      <li>
        <button onClick={() => void logout()}>Logout</button>
      </li>
    </ul>
  );
}
