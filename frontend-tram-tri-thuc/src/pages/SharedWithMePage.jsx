import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocumentItem from "../components/Document/DocumentItem";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Home from "./Home/Home";
import { fetchSharedWithMe } from "../redux/slices/shareSlice";
import ErrorMessage from "../components/common/ErrorMessage";

const SharedWithMePage = () => {
    const dispatch = useDispatch();
    const { sharedWithMeDocuments, loadingSharedWithMe, error } = useSelector(
        (state) => state.share
    );
    const [view, setView] = useState("list");

    useEffect(() => {
        dispatch(fetchSharedWithMe());
    }, [dispatch]);

    const handlePreview = (document) => {
        // Logic xem trước (tương tự DocumentDetail)
        window.open(document.url, "_blank");
    };

    const handleDoubleClick = (document) => {
        if (document.type === "file") {
            window.open(document.url, "_blank");
        }
    };

    if (loadingSharedWithMe) {
        return (
            <Home>
                <LoadingSpinner size="medium" />
            </Home>
        );
    }

    if (error) {
        return (
            <Home>
                <ErrorMessage message={error} />
            </Home>
        );
    }

    return (
        <Home>
            <div className="p-6 gradient-bg rounded-lg min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Tài liệu được chia sẻ với tôi
                    </h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setView("list")}
                            className={`px-4 py-2 rounded-md ${
                                view === "list"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                            }`}
                        >
                            Danh sách
                        </button>
                        <button
                            onClick={() => setView("grid")}
                            className={`px-4 py-2 rounded-md ${
                                view === "grid"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                            }`}
                        >
                            Lưới
                        </button>
                    </div>
                </div>
                {sharedWithMeDocuments.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">
                        Chưa có tài liệu được chia sẻ với bạn.
                    </p>
                ) : view === "list" ? (
                    <table className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="py-3 px-4 text-gray-700 dark:text-gray-200">Tên</th>
                                <th className="py-3 px-4 text-gray-700 dark:text-gray-200">
                                    Ngày tải lên
                                </th>
                                <th className="py-3 px-4 text-gray-700 dark:text-gray-200">
                                    Kích thước
                                </th>
                                <th className="py-3 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sharedWithMeDocuments.map((doc) => (
                                <DocumentItem
                                    key={doc._id}
                                    document={doc}
                                    onPreview={() => handlePreview(doc)}
                                    onDoubleClick={() => handleDoubleClick(doc)}
                                    view="list"
                                    isTrash={false}
                                />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sharedWithMeDocuments.map((doc) => (
                            <DocumentItem
                                key={doc._id}
                                document={doc}
                                onPreview={() => handlePreview(doc)}
                                onDoubleClick={() => handleDoubleClick(doc)}
                                view="grid"
                                isTrash={false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Home>
    );
};

export default SharedWithMePage;
