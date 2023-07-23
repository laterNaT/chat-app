import { Link } from "react-router-dom";

export default function TopNavBar() {
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
        <button>Logout</button>
      </li>
    </ul>
  );
}
