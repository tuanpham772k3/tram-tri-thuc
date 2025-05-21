import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import showToast from "../utils/toast";

export default function UploaderRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { userInfo } = useSelector((state) => state.user);

    if (!isAuthenticated) {
        showToast("error", "Vui lòng đăng nhập để tiếp tục.");
        return <Navigate to="/auth/login" />;
    }
    if (!userInfo || !["uploader", "admin"].includes(userInfo.role)) {
        showToast("error", "Bạn cần quyền uploader để truy cập.");
        return <Navigate to="/" />;
    }

    return children;
}
