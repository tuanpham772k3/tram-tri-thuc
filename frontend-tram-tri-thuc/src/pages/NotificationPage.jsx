import { Link } from "react-router-dom";

const NotificationPage = () => {
    const notifications = [
        {
            id: 1,
            content: "Tài liệu 'Lập trình Web' đã được duyệt",
            link: "/documents/1",
            isRead: false,
        },
        {
            id: 2,
            content: "Người dùng A đã bình luận tài liệu của bạn",
            link: "/documents/2",
            isRead: true,
        },
    ];

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Thông báo</h2>
            <ul className="space-y-2">
                {notifications.map((noti) => (
                    <li
                        key={noti.id}
                        className={`p-4 rounded shadow ${noti.isRead ? "bg-gray-100" : "bg-blue-50"}`}
                    >
                        <Link to={noti.link} className="text-blue-600 hover:underline">
                            {noti.content}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationPage;
