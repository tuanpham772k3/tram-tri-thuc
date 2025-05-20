import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UploaderRoute({ children }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/auth/login" />;
    if (!user || user.role !== "uploader") return <Navigate to="/" />;

    return children;
}
