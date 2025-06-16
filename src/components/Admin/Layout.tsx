import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import ScrollToTop from "../ScrollToTop";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  return (
    <div className="flex font-primary min-h-screen relative">
      <ScrollToTop />
      <Sidebar />
      <div className="w-full min-h-screen bg-gray-50 px-10 py-10">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
}
