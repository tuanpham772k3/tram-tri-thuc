import Navbar from "../../components/Header/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

const Home = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar isLoggedIn={true} />
            <div className="flex pt-16">
                <Sidebar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
};

export default Home;
