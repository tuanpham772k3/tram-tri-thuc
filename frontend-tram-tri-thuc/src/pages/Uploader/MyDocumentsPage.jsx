import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, deleteDocument, fetchMyDocuments } from "../../store/slices/documentSlice";
import showToast from "../../utils/toast";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiUpload, FiClock, FiCheck } from "react-icons/fi";
import { 
    FaBook, FaGraduationCap, FaPencilAlt, FaLightbulb, 
    FaBrain, FaChalkboardTeacher, FaBookReader, FaAtom,
    FaUniversity, FaUserGraduate, FaSchool, FaBookOpen,
    FaDesktop, FaMicroscope, FaFlask, FaCalculator
} from "react-icons/fa";

export default function MyDocumentsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myDocuments, loading, error } = useSelector((state) => state.documents);
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            showToast("error", "Vui lòng đăng nhập để xem tài liệu.");
            navigate("/auth/login");
        } else if (!userInfo || !["uploader", "admin"].includes(userInfo.role)) {
            showToast("error", "Bạn cần quyền uploader để truy cập.");
            navigate("/");
        } else {
            dispatch(fetchMyDocuments());
        }
        return () => dispatch(clearError());
    }, [dispatch, navigate, userInfo]);

    useEffect(() => {
        if (error) {
            showToast(
                "error",
                error === "Không thể lấy danh sách tài liệu cá nhân"
                    ? "Lỗi khi tải tài liệu. Vui lòng kiểm tra quyền truy cập hoặc đăng nhập lại."
                    : error
            );
        }
    }, [error]);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa tài liệu này?")) {
            dispatch(deleteDocument(id))
                .unwrap()
                .then(() => showToast("success", "Xóa tài liệu thành công!"))
                .catch((err) => showToast("error", err || "Lỗi khi xóa tài liệu."));
        }
    };

    return (
        <div className="min-h-screen relative -mt-16">
            {/* Background Base with enhanced gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '30px 30px'
                    }}
                />
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Circles */}
                <div className="absolute w-full h-full">
                    {/* Large Circle with Icon */}
                    <div 
                        className="absolute w-96 h-96 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                        style={{
                            top: '10%',
                            left: '15%',
                            animation: 'float 20s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute text-emerald-600 opacity-50"
                        style={{
                            top: '15%',
                            left: '20%',
                            animation: 'float 12s ease-in-out infinite'
                        }}
                    >
                        <FaGraduationCap className="w-20 h-20" />
                    </div>
                    
                    {/* Medium Circle with Icon */}
                    <div 
                        className="absolute w-72 h-72 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                        style={{
                            top: '40%',
                            right: '15%',
                            animation: 'float 15s ease-in-out infinite',
                            animationDelay: '-5s'
                        }}
                    />
                    <div 
                        className="absolute text-teal-600 opacity-50"
                        style={{
                            top: '45%',
                            right: '20%',
                            animation: 'float 14s ease-in-out infinite',
                            animationDelay: '-3s'
                        }}
                    >
                        <FaBook className="w-16 h-16" />
                    </div>
                    
                    {/* Small Circle with Icon */}
                    <div 
                        className="absolute w-48 h-48 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                        style={{
                            bottom: '20%',
                            left: '25%',
                            animation: 'float 10s ease-in-out infinite',
                            animationDelay: '-7s'
                        }}
                    />
                    <div 
                        className="absolute text-cyan-600 opacity-50"
                        style={{
                            bottom: '25%',
                            left: '30%',
                            animation: 'float 16s ease-in-out infinite',
                            animationDelay: '-6s'
                        }}
                    >
                        <FaLightbulb className="w-12 h-12" />
                    </div>
                </div>

                {/* Floating Educational Icons */}
                <div className="absolute inset-0">
                    <div 
                        className="absolute text-emerald-500 opacity-30"
                        style={{ 
                            top: '35%', 
                            right: '35%',
                            animation: 'float 18s ease-in-out infinite',
                            animationDelay: '-2s'
                        }}
                    >
                        <FaBrain className="w-10 h-10" />
                    </div>
                    <div 
                        className="absolute text-teal-500 opacity-30"
                        style={{ 
                            top: '65%', 
                            right: '25%',
                            animation: 'float 20s ease-in-out infinite',
                            animationDelay: '-7s'
                        }}
                    >
                        <FaPencilAlt className="w-8 h-8" />
                    </div>
                    <div 
                        className="absolute text-cyan-500 opacity-30"
                        style={{ 
                            bottom: '40%', 
                            left: '40%',
                            animation: 'float 22s ease-in-out infinite',
                            animationDelay: '-4s'
                        }}
                    >
                        <FaChalkboardTeacher className="w-14 h-14" />
                    </div>
                    {/* New Icons */}
                    <div 
                        className="absolute text-blue-500 opacity-30"
                        style={{ 
                            top: '20%', 
                            right: '45%',
                            animation: 'float 19s ease-in-out infinite',
                            animationDelay: '-1s'
                        }}
                    >
                        <FaUniversity className="w-12 h-12" />
                    </div>
                    <div 
                        className="absolute text-purple-500 opacity-30"
                        style={{ 
                            bottom: '30%', 
                            right: '15%',
                            animation: 'float 21s ease-in-out infinite',
                            animationDelay: '-8s'
                        }}
                    >
                        <FaUserGraduate className="w-10 h-10" />
                    </div>
                    <div 
                        className="absolute text-indigo-500 opacity-30"
                        style={{ 
                            top: '50%', 
                            left: '20%',
                            animation: 'float 17s ease-in-out infinite',
                            animationDelay: '-3s'
                        }}
                    >
                        <FaSchool className="w-16 h-16" />
                    </div>
                    <div 
                        className="absolute text-pink-500 opacity-30"
                        style={{ 
                            top: '25%', 
                            left: '35%',
                            animation: 'float 23s ease-in-out infinite',
                            animationDelay: '-6s'
                        }}
                    >
                        <FaBookOpen className="w-12 h-12" />
                    </div>
                    <div 
                        className="absolute text-red-500 opacity-30"
                        style={{ 
                            bottom: '25%', 
                            left: '15%',
                            animation: 'float 16s ease-in-out infinite',
                            animationDelay: '-5s'
                        }}
                    >
                        <FaDesktop className="w-10 h-10" />
                    </div>
                    <div 
                        className="absolute text-yellow-500 opacity-30"
                        style={{ 
                            top: '15%', 
                            left: '45%',
                            animation: 'float 24s ease-in-out infinite',
                            animationDelay: '-9s'
                        }}
                    >
                        <FaMicroscope className="w-14 h-14" />
                    </div>
                    <div 
                        className="absolute text-green-500 opacity-30"
                        style={{ 
                            bottom: '15%', 
                            right: '40%',
                            animation: 'float 20s ease-in-out infinite',
                            animationDelay: '-4s'
                        }}
                    >
                        <FaFlask className="w-12 h-12" />
                    </div>
                    <div 
                        className="absolute text-blue-400 opacity-30"
                        style={{ 
                            top: '40%', 
                            right: '10%',
                            animation: 'float 18s ease-in-out infinite',
                            animationDelay: '-7s'
                        }}
                    >
                        <FaCalculator className="w-10 h-10" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto px-4"
                >
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-900">Tài liệu của tôi</h1>
                            <Link
                                to="/uploader/upload"
                                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <FiUpload className="mr-2" />
                                Tải lên tài liệu mới
                            </Link>
                        </div>
                        <p className="mt-2 text-gray-600">Quản lý và theo dõi các tài liệu bạn đã đăng tải</p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents List */}
                    {!loading && !error && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                            {myDocuments.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {myDocuments.map((doc) => (
                                        <motion.li
                                            key={doc._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                            {doc.title}
                                                        </h3>
                                                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                            <span>
                                                                Đăng ngày: {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                    doc.status === "approved"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-yellow-100 text-yellow-800"
                                                                }`}>
                                                                    {doc.status === "approved" ? <FiCheck className="w-4 h-4 mr-1" /> : <FiClock className="w-4 h-4 mr-1" />}
                                                                    {doc.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <Link
                                                            to={`/edit-document/${doc._id}`}
                                                            className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <FiEdit2 className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(doc._id)}
                                                            className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Xóa"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Chưa có tài liệu nào.</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    25% {
                        transform: translate(20px, -20px) rotate(5deg);
                    }
                    50% {
                        transform: translate(-10px, 20px) rotate(-5deg);
                    }
                    75% {
                        transform: translate(-20px, -10px) rotate(3deg);
                    }
                }
            `}</style>
        </div>
    );
}