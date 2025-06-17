import { Outlet } from "react-router";
import Navbar from "./components/Client/Navbar";
import Footer from "./components/Client/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { UserProvider } from "./contexts/userContext.tsx";

function App() {
  return (
    <UserProvider>
      <div className="font-primary">
        <ScrollToTop />
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;
