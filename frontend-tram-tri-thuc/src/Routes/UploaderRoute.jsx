import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UploaderRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { userInfo } = useSelector((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" />;
    }
    if (!userInfo || !["uploader", "admin"].includes(userInfo.role)) {
        return <Navigate to="/" />;
    }

    return children;
}
