import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import ScrollToTop from "../ScrollToTop";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "../Protected";

export default function Layout() {
  return (
    <div className="flex font-primary min-h-screen relative">
      <ScrollToTop />
      <Sidebar />
      <ProtectedRoute requiredRole="ADMIN" />
      <div className="w-full min-h-screen bg-gray-50 px-10 py-10">
        <Outlet />
      </div>
      <ToastContainer theme="colored" />
    </div>
  );
}
