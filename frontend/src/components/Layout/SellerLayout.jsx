import { Outlet } from "react-router-dom";
import SellerSidebar from "./Sidebar/SellerSidebar";

const SellerLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <SellerSidebar />

      <main className="ml-14 md:ml-64 flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
