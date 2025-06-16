import { Outlet } from "react-router";
import Navbar from "./components/Client/Navbar";
import Footer from "./components/Client/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="font-primary">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
