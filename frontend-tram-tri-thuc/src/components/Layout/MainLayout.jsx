import { Outlet } from "react-router-dom";
import Navbar from "./Header/Navbar";
import MobileResponsiveWrapper from "./MobileResponsiveWrapper";
import Sidebar from "./Sidebar/Sidebar";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <MobileResponsiveWrapper>
                    <Sidebar />
                </MobileResponsiveWrapper>
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
