import { Outlet } from "react-router";
import Navbar from "./components/Client/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import Chatbot from "./pages/Client/Chatbot";
function App() {
  return (
    <div className="font-primary ">
      <ScrollToTop />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
        <Chatbot />
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
