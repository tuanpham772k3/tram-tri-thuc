import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocumentItem from "../../components/Document/DocumentItem";
import Home from "../Home/Home";
import { fetchSharedWithMe } from "../../redux/slices/shareSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const SharedWithMePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sharedWithMeDocuments, loadingSharedWithMe, error } = useSelector(
        (state) => state.share
    );
    const { user } = useSelector((state) => state.auth);
    const [view, setView] = useState("list");

    useEffect(() => {
        console.log("Fetching shared documents for user:", {
            userId: user?._id,
            email: user?.email,
        });
        dispatch(fetchSharedWithMe());
    }, [dispatch, user]);

    useEffect(() => {
        if (sharedWithMeDocuments.length > 0) {
            console.log("Shared documents received:", {
                count: sharedWithMeDocuments.length,
                documents: sharedWithMeDocuments.map((doc) => ({
                    _id: doc._id,
                    name: doc.name,
                    sharedWith: doc.share?.sharedWith,
                    owner: doc.userId?.email,
                })),
            });
        }
    }, [sharedWithMeDocuments]);

    const handlePreview = (document) => {
        if (document._id) {
            navigate(`/shared/${document._id}`);
        }
    };

    const handleDoubleClick = (document) => {
        if (document.type === "file" && document._id) {
            navigate(`/shared/${document._id}`);
        } else {
            console.warn("Invalid document ID or type:", document);
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
                                    Người chia sẻ
                                </th>
                                <th className="py-3 px-4 text-gray-700 dark:text-gray-200">
                                    Ngày tải lên
                                </th>
                                <th className="py-3 px-4 text-gray-700 dark:text-gray-200">
                                    Kích thước
                                </th>
                                <th className="py-3 px-4 text-gray-700 dark:text-gray-200">
                                    Quyền
                                </th>
                                <th className="py-3 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sharedWithMeDocuments.map((doc) => {
                                // Tìm người chia sẻ trong share.sharedWith
                                const sharedEntry = doc.share?.sharedWith.find(
                                    (item) =>
                                        item.email === user?.email || item.userId?._id === user?._id
                                );
                                const permission =
                                    doc.userId?._id === user?._id
                                        ? "owner"
                                        : sharedEntry?.permission || "viewer";
                                const sharerInfo = sharedEntry?.userId
                                    ? {
                                          email: sharedEntry.userId.email,
                                          avatar: sharedEntry.userId.avatar,
                                      }
                                    : doc.userId
                                      ? {
                                            email: doc.userId.email,
                                            avatar: doc.userId.avatar,
                                        }
                                      : { email: "Không xác định", avatar: null };

                                return (
                                    <DocumentItem
                                        key={doc._id}
                                        document={{
                                            ...doc,
                                            permission,
                                        }}
                                        sharerInfo={sharerInfo}
                                        onPreview={() => handlePreview(doc)}
                                        onDoubleClick={() => handleDoubleClick(doc)}
                                        view="list"
                                        isTrash={false}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sharedWithMeDocuments.map((doc) => {
                            const sharedEntry = doc.share?.sharedWith.find(
                                (item) =>
                                    item.email === user?.email || item.userId?._id === user?._id
                            );
                            const permission =
                                doc.userId?._id === user?._id
                                    ? "owner"
                                    : sharedEntry?.permission || "viewer";
                            const sharerInfo = sharedEntry?.userId
                                ? {
                                      email: sharedEntry.userId.email,
                                      avatar: sharedEntry.userId.avatar,
                                  }
                                : doc.userId
                                  ? {
                                        email: doc.userId.email,
                                        avatar: doc.userId.avatar,
                                    }
                                  : { email: "Không xác định", avatar: null };

                            return (
                                <DocumentItem
                                    key={doc._id}
                                    document={{
                                        ...doc,
                                        permission,
                                    }}
                                    sharerInfo={sharerInfo}
                                    onPreview={() => handlePreview(doc)}
                                    onDoubleClick={() => handleDoubleClick(doc)}
                                    view="grid"
                                    isTrash={false}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </Home>
    );
};

export default SharedWithMePage;
