import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Header/Navbar";
import { useSelector } from "react-redux";

export default function MainLayout() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar at top */}
            <Navbar />

            <div className="flex flex-1">
                {/* Fixed Sidebar */}
                {isAuthenticated && (
                    <div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)]">
                        <Sidebar />
                    </div>
                )}

                {/* Main Content - with margin to account for fixed sidebar */}
                <div className={`flex-1 pt-2 ${isAuthenticated ? "ml-64" : "ml-0"}`}>
                    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
