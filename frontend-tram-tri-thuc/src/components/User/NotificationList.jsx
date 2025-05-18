const NotificationList = ({ notifications = [] }) => {
    return (
        <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-lg z-50">
            <ul>
                {notifications.map((n, i) => (
                    <li key={i} className="p-2 hover:bg-gray-100 text-sm border-b">
                        {n.content}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationList;
