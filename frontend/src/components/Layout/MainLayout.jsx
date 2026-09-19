import { Outlet } from "react-router-dom";
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-muted text-text-main">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
