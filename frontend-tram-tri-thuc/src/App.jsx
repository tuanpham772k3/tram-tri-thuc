import { Route, Routes } from "react-router-dom";
import DocumentList from "./pages/DocumentList";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing";
import DocumentDetail from "./pages/DocumentDetail";
import Profile from "./pages/Profile";
import StorageStats from "./pages/StorageStats";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<DocumentList />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/document/:id" element={<DocumentDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/storage" element={<StorageStats />} />
        </Routes>
    );
}

export default App;
