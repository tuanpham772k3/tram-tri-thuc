import { useEffect, useState } from "react";
import UploadDropzone from "../components/UploadDropzone/UploadDropzone";
import DocumentCard from "../components/DocumentCard/DocumentCard";
import Home from "./Home/Home";
import { FaList, FaTh } from "react-icons/fa";

const DocumentList = () => {
    const [view, setView] = useState("grid");
    // const [documents, setDocuments] = useState([]);

    // useEffect(() => {
    //     fetch("http://localhost:3000/documents")
    //         .then((res) => res.json())
    //         .then((data) => setDocuments(data));
    // }, []);

    const documents = [
        { _id: 1, name: "Document 1.pdf", date: "2023-10-01" },
        { _id: 2, name: "Document 2.docx", date: "2023-10-02" },
        { _id: 3, name: "Document 3.pptx", date: "2023-10-03" },
    ];

    return (
        <Home>
            <div className="space-y-6 gradient-bg p-6 rounded-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Tài liệu của tôi
                    </h2>
                    <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
                        <button
                            onClick={() => setView("grid")}
                            className={`p-2 rounded-full ${view === "grid" ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300"} transition-colors`}
                        >
                            <FaTh size={16} />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`p-2 rounded-full ${view === "list" ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300"} transition-colors`}
                        >
                            <FaList size={16} />
                        </button>
                    </div>
                </div>
                <UploadDropzone />
                <div
                    className={
                        view === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                            : "space-y-4"
                    }
                >
                    {documents.length > 0 ? (
                        documents.map((doc) => (
                            <DocumentCard
                                key={doc._id}
                                document={{
                                    name: doc.name,
                                    date: doc.date,
                                    type: doc.name.split(".").pop(),
                                }}
                                view={view}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300">
                            Chưa có tài liệu nào.
                        </p>
                    )}
                </div>
            </div>
        </Home>
    );
};

export default DocumentList;
