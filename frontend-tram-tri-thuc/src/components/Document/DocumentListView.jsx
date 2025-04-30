import React from "react";
import PropTypes from "prop-types";
import DocumentItem from "./DocumentItem";

const DocumentListView = ({
    documents,
    view,
    sortBy,
    sortDirection,
    onSort,
    onDrop,
    isTrash,
    navigate,
}) => {
    const sortedDocuments = [...documents].sort((a, b) => {
        if (sortBy === "name") {
            return sortDirection === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } else if (sortBy === "date") {
            return sortDirection === "asc"
                ? new Date(a.uploadDate) - new Date(b.uploadDate)
                : new Date(b.uploadDate) - new Date(a.uploadDate);
        } else if (sortBy === "size") {
            return sortDirection === "asc" ? a.size - b.size : b.size - a.size;
        }
        return 0;
    });

    const folders = sortedDocuments.filter((doc) => doc.type === "folder");
    const files = sortedDocuments.filter((doc) => doc.type === "file");

    return (
        <div className="mt-6">
            {view === "list" ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="py-3 px-4 text-left" onClick={() => onSort("name")}>
                                    <div className="flex items-center cursor-pointer">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Tên
                                        </span>
                                        {sortBy === "name" && (
                                            <span className="ml-1">
                                                {sortDirection === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-left" onClick={() => onSort("date")}>
                                    <div className="flex items-center cursor-pointer">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {isTrash ? "Ngày xóa" : "Ngày tải lên"}
                                        </span>
                                        {sortBy === "date" && (
                                            <span className="ml-1">
                                                {sortDirection === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-left" onClick={() => onSort("size")}>
                                    <div className="flex items-center cursor-pointer">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Dung lượng
                                        </span>
                                        {sortBy === "size" && (
                                            <span className="ml-1">
                                                {sortDirection === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDocuments.map((doc) => (
                                <DocumentItem
                                    key={doc._id}
                                    document={doc}
                                    view="list"
                                    isTrash={isTrash}
                                    onPreview={() =>
                                        doc.type === "folder"
                                            ? navigate(`/documents?parentId=${doc._id}`)
                                            : navigate(`/documents/${doc._id}`)
                                    }
                                    onDoubleClick={() =>
                                        !isTrash &&
                                        (doc.type === "folder"
                                            ? navigate(`/documents?parentId=${doc._id}`)
                                            : navigate(`/documents/${doc._id}`))
                                    }
                                    onDrop={onDrop}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>
                    {folders.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Thư mục
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {folders.map((folder) => (
                                    <DocumentItem
                                        key={folder._id}
                                        document={folder}
                                        view="grid"
                                        isTrash={isTrash}
                                        onDoubleClick={() =>
                                            !isTrash &&
                                            navigate(`/documents?parentId=${folder._id}`)
                                        }
                                        onDrop={onDrop}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {files.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Tệp
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {files.map((file) => (
                                    <DocumentItem
                                        key={file._id}
                                        document={file}
                                        view="grid"
                                        isTrash={isTrash}
                                        onPreview={() =>
                                            !isTrash && navigate(`/documents/${file._id}`)
                                        }
                                        onDoubleClick={() =>
                                            !isTrash && navigate(`/documents/${file._id}`)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

DocumentListView.propTypes = {
    documents: PropTypes.array.isRequired,
    view: PropTypes.oneOf(["list", "grid"]).isRequired,
    sortBy: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
    onSort: PropTypes.func.isRequired,
    onDrop: PropTypes.func,
    isTrash: PropTypes.bool,
    navigate: PropTypes.func.isRequired,
};

export default DocumentListView;
