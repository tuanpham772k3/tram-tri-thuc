import React, { useState } from "react";
import Navbar from "../../components/Header/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Content from "../../components/Content/Content";
import Modal from "../../components/Modals/Modal";

const Home = () => {
    const [modalType, setModalType] = useState(null);
    return (
        <div className="flex flex-col h-screen w-screen bg-gray-100">
            <Navbar />
            <div className="flex flex-1 pt-16">
                <Sidebar />
                <Content setModalType={setModalType} />
            </div>
            {modalType && (
                <Modal type={modalType} onClose={() => setModalType(null)} />
            )}
        </div>
    );
};

export default Home;
