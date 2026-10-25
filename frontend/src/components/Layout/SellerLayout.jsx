import { Outlet } from "react-router-dom";
import SellerSidebar from "./Sidebar/SellerSidebar";

const SellerLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <SellerSidebar />

      <main className="z-20 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
