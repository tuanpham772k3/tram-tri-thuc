import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Header/Navbar";

function App() {
    return (
        <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 h-full">
                <Navbar />
                <main className="flex-1 p-4 overflow-auto">Nội dung chính</main>
            </div>
        </div>
    );
}

export default App;
