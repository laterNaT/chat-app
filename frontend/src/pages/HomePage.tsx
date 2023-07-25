import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";

export default function HomePage() {
  return (
    <>
      <TopNavBar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
}
