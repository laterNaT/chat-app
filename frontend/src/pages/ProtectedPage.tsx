import { Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";

export default function ProtectedPage() {
  return (
    <>
      <TopNavBar />
      <h1>Protected Page</h1>
      <Outlet />
    </>
  );
}
