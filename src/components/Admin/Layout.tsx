import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ScrollToTop from "../ScrollToTop";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  return (
    <div className="flex font-primary h-screen relative">
      <ScrollToTop />
      <Sidebar />
      <div className="w-full min-h-screen">
        <div className="sticky left-0 top-0 w-full z-1">
          <Header />
        </div>
        <div className="p-6 bg-gray-50 h-min-screen">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
