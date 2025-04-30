import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Home from "../Home/Home";
import PageHeader from "../../components/Layout/PageHeader";
import DocumentListView from "../../components/Document/DocumentListView";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ErrorMessage from "../../components/Common/ErrorMessage";
import { fetchDocuments } from "../../redux/slices/documentSlice";

const Starred = () => {
    const [view, setView] = useState("list");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    const dispatch = useDispatch();
    const { documents, loading, error } = useSelector((state) => state.documents);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            dispatch(fetchDocuments({ starred: true, includeChildren: true }))
                .unwrap()
                .catch((error) => {
                    toast.error(error);
                    if (error === "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại") {
                        navigate("/login");
                    }
                });
        }
    }, [token, dispatch, navigate]);

    const uniqueDocuments = Array.from(
        new Map(
            documents
                .filter((doc) => doc && doc._id && doc.name && doc.starred && !doc.deleted)
                .map((doc) => [doc._id, doc])
        )
    ).map(([_, doc]) => doc);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    return (
        <Home>
            <div className="max-w-6xl mx-auto p-6 gradient-bg rounded-lg shadow">
                <PageHeader title="Có đánh dấu sao" view={view} onViewChange={setView} />
                {loading ? (
                    <LoadingSpinner size="medium" />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : uniqueDocuments.length ? (
                    <DocumentListView
                        documents={uniqueDocuments}
                        view={view}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        navigate={navigate}
                    />
                ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center mt-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            Chưa có tài liệu nào được đánh dấu sao. Hãy đánh dấu sao cho tài liệu
                            hoặc thư mục yêu thích!
                        </p>
                    </div>
                )}
            </div>
        </Home>
    );
};

export default Starred;
