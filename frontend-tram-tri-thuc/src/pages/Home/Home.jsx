import Navbar from "../../components/Header/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

const Home = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Navbar cố định trên cùng */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50">
                <Navbar isLoggedIn={true} />
            </div>

            <div className="flex pt-16">
                {" "}
                {/* Thêm padding-top để không bị navbar che */}
                {/* Sidebar cố định */}
                <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
                    <Sidebar />
                </div>
                {/* Main content */}
                <div className="ml-64 w-[calc(100%-16rem)] p-6">{children}</div>
            </div>
        </div>
    );
};

export default Home;
