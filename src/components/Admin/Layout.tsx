import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import ScrollToTop from "../ScrollToTop";

export default function Layout() {
  return (
    <div className="flex font-primary h-screen relative">
      <ScrollToTop />
      <Sidebar />
      <div className="w-full min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}
