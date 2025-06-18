import { Outlet } from "react-router";
import Navbar from "./components/Client/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="font-primary ">
      <ScrollToTop />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <ToastContainer theme="colored" />
    </div>
  );
}

export default App;
