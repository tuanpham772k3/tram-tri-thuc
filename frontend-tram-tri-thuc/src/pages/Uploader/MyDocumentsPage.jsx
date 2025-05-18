const MyDocumentsPage = () => {
    const mockDocuments = [
        { id: 1, title: "Tài liệu React", createdAt: "2025-05-01", isApproved: true },
        { id: 2, title: "Tài liệu NodeJS", createdAt: "2025-04-28", isApproved: false },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Tài liệu của tôi</h1>
            {mockDocuments.length > 0 ? (
                <ul className="space-y-3">
                    {mockDocuments.map((doc) => (
                        <li key={doc.id} className="p-4 border rounded shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{doc.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        Đăng ngày: {doc.createdAt}
                                    </p>
                                    <p className="text-sm">
                                        Trạng thái: {doc.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                                    </p>
                                </div>
                                <a href={`/edit-document/${doc.id}`} className="btn btn-outline">
                                    Chỉnh sửa
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">Không có tài liệu nào để hiển thị.</p>
            )}
        </div>
    );
};

export default MyDocumentsPage;
