import { Route, Routes } from "react-router-dom";
import Home from "../../pages/Home/Home";
import Landing from "../../pages/Landing";
import DocumentList from "../../pages/DocumentList";
import DocumentDetail from "../../pages/DocumentDetail";
import Profile from "../../pages/Profile";
import StorageStats from "../../pages/StorageStats";

const RouterCustom = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<DocumentList />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/document/:id" element={<DocumentDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/storage" element={<StorageStats />} />
        </Routes>
    );
};

export default RouterCustom;
