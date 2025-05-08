import React from "react";
import PropTypes from "prop-types";
import { formatFileSize, formatDate } from "../../utils/helpers";
import ActionButtonGroup from "./ActionButtonGroup";

const DocumentInfoCard = ({
    document,
    permission,
    showActions,
    onPreview,
    onRename,
    onStar,
    onDelete,
    onShare,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Thông tin chi tiết
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                    <span className="font-medium">Tên file:</span> {document.name}
                </p>
                <p>
                    <span className="font-medium">Loại:</span>{" "}
                    {document.mimeType?.split("/")[1] || document.type}
                </p>
                <p>
                    <span className="font-medium">Kích thước:</span> {formatFileSize(document.size)}
                </p>
                <p>
                    <span className="font-medium">Ngày upload:</span>{" "}
                    {formatDate(document.uploadDate)}
                </p>
                <p>
                    <span className="font-medium">Quyền:</span>{" "}
                    {permission === "owner"
                        ? "Chủ sở hữu"
                        : permission === "editor"
                          ? "Người chỉnh sửa"
                          : "Người xem"}
                </p>
                <p>
                    <span className="font-medium">URL:</span>{" "}
                    <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all"
                    >
                        Xem trên Google Drive
                    </a>
                </p>
            </div>
            {showActions && (
                <div className="mt-6 flex flex-col space-y-3">
                    <ActionButtonGroup
                        document={document}
                        view="grid"
                        onPreview={onPreview}
                        onRename={onRename}
                        onStar={onStar}
                        onDelete={onDelete}
                    />
                </div>
            )}
        </div>
    );
};

DocumentInfoCard.propTypes = {
    document: PropTypes.object.isRequired,
    showActions: PropTypes.bool,
    onPreview: PropTypes.func,
    onRename: PropTypes.func,
    onStar: PropTypes.func,
    onDelete: PropTypes.func,
};

export default DocumentInfoCard;
