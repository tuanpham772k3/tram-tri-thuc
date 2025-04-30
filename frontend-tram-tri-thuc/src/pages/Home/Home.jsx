import { useState } from "react";
import Navbar from "../../components/Layout/Header/Navbar";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import ModalShare from "../../components/Ui/ShareModal/ModalShare";

const Home = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLogout = () => {
        // Your logout logic here
        console.log("Logged out");
    };

    return (
        <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                {/* Navbar fixed at top */}
                <div className="fixed top-0 left-0 right-0 z-10">
                    <Navbar
                        isLoggedIn={true}
                        darkMode={darkMode}
                        toggleDarkMode={toggleDarkMode}
                        handleLogout={handleLogout}
                    />
                </div>

                <div className="flex pt-16 h-screen">
                    {/* Sidebar fixed on the left */}
                    <div className="hidden md:block md:w-64 flex-shrink-0 h-full fixed top-16 left-0 border-r border-gray-200 dark:border-gray-800">
                        <Sidebar />
                    </div>

                    {/* Mobile sidebar overlay - would need to be implemented with state to show/hide */}

                    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                        <Outlet />
                        <ModalShare />
                    </div>

                    {/* Main content */}
                    <div className="w-full md:ml-64 flex-1 overflow-auto">
                        <div className="p-6">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
