import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/home">Home</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
