import { useState } from "react";
import { Bell } from "lucide-react";

const NotificationBell = ({ onClick }) => {
    const [hasUnread, setHasUnread] = useState(true);

    return (
        <div className="relative cursor-pointer" onClick={onClick}>
            <Bell />
            {hasUnread && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping" />
            )}
        </div>
    );
};

export default NotificationBell;
