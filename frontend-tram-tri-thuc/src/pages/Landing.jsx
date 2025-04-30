import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Header/Navbar";

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-800 dark:to-gray-900">
            <Navbar isLoggedIn={false} />
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
                    Chào mừng đến với Trạm Tri thức
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
                    Quản lý tài liệu dễ dàng, mọi lúc mọi nơi
                </p>
                <div className="space-x-4">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600">
                        <Link to={"/login"}>Đăng nhập</Link>
                    </button>
                    <button className="bg-transparent border border-blue-500 text-blue-500 px-6 py-3 rounded-full hover:bg-blue-500 hover:text-white">
                        Đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
