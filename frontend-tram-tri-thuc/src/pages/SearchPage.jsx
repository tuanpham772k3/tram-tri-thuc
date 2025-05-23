import { useState, useEffect, useMemo } from "react";
import SearchBar from "../components/Document/SearchBar";
import DocumentCard from "../components/Document/DocumentCard";
import FilterPanel from "../components/Document/FilterPanel";
import { motion } from "framer-motion";
import { 
    FaBook, FaGraduationCap, FaPencilAlt, FaLightbulb, FaBrain, 
    FaChalkboardTeacher, FaBookReader, FaAtom, FaUniversity, FaUserGraduate,
    FaSchool, FaBookOpen, FaDesktop, FaCalculator
} from "react-icons/fa";

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ category: "", uploader: "", format: "" });
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await new Promise((resolve) =>
                    setTimeout(() =>
                        resolve([
                            {
                                id: 1,
                                title: "Báo cáo AI",
                                uploader: "Nguyễn Văn A",
                                mimeType: "application/pdf",
                                category: "Công nghệ",
                            },
                            {
                                id: 2,
                                title: "Kinh tế vĩ mô",
                                uploader: "Trần Thị B",
                                mimeType: "application/vnd.ms-powerpoint",
                                category: "Kinh tế",
                            },
                        ]), 1000)
                );
                setDocuments(response);
            } catch (err) {
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredDocuments = useMemo(() => {
        return documents.filter((doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filters.category === "" || doc.category === filters.category) &&
            (filters.uploader === "" || doc.uploader.includes(filters.uploader)) &&
            (filters.format === "" || doc.mimeType.includes(filters.format))
        );
    }, [documents, searchQuery, filters]);

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
                        className="absolute w-96 h-96 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-slow"
                        style={{
                            top: '10%',
                            left: '15%',
                        }}
                    />
                    <div 
                        className="absolute text-emerald-600 opacity-50 animate-float-icon-1"
                        style={{
                            top: '15%',
                            left: '20%',
                        }}
                    >
                        <FaGraduationCap className="w-20 h-20" />
                    </div>
                    
                    {/* Medium Circle with Icon */}
                    <div 
                        className="absolute w-72 h-72 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-medium"
                        style={{
                            top: '40%',
                            right: '15%',
                        }}
                    />
                    <div 
                        className="absolute text-teal-600 opacity-50 animate-float-icon-2"
                        style={{
                            top: '45%',
                            right: '20%',
                        }}
                    >
                        <FaBook className="w-16 h-16" />
                    </div>
                    
                    {/* Small Circle with Icon */}
                    <div 
                        className="absolute w-48 h-48 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-fast"
                        style={{
                            bottom: '20%',
                            left: '25%',
                        }}
                    />
                    <div 
                        className="absolute text-cyan-600 opacity-50 animate-float-icon-3"
                        style={{
                            bottom: '25%',
                            left: '30%',
                        }}
                    >
                        <FaLightbulb className="w-12 h-12" />
                    </div>
                </div>

                {/* Floating Educational Icons */}
                <div className="absolute inset-0">
                    <div 
                        className="absolute text-emerald-500 opacity-30 animate-float-icon-4"
                        style={{ top: '35%', right: '35%' }}
                    >
                        <FaBrain className="w-10 h-10" />
                    </div>
                    <div 
                        className="absolute text-teal-500 opacity-30 animate-float-icon-5"
                        style={{ top: '65%', right: '25%' }}
                    >
                        <FaPencilAlt className="w-8 h-8" />
                    </div>
                    <div 
                        className="absolute text-cyan-500 opacity-30 animate-float-icon-6"
                        style={{ bottom: '40%', left: '40%' }}
                    >
                        <FaChalkboardTeacher className="w-14 h-14" />
                    </div>
                    <div 
                        className="absolute text-blue-500 opacity-30 animate-float-icon-7"
                        style={{ top: '25%', left: '45%' }}
                    >
                        <FaBookReader className="w-12 h-12" />
                    </div>
                    <div 
                        className="absolute text-purple-500 opacity-30 animate-float-icon-8"
                        style={{ bottom: '30%', right: '45%' }}
                    >
                        <FaAtom className="w-16 h-16" />
                    </div>
                    <div 
                        className="absolute text-indigo-500 opacity-30 animate-float-icon-9"
                        style={{ top: '55%', left: '15%' }}
                    >
                        <FaUniversity className="w-14 h-14" />
                    </div>
                    <div 
                        className="absolute text-green-500 opacity-30 animate-float-icon-10"
                        style={{ bottom: '60%', right: '20%' }}
                    >
                        <FaUserGraduate className="w-11 h-11" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto px-4"
                >
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold mb-6 text-center text-gray-800"
                    >
                        🔍 Tìm kiếm tài liệu
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-4"
                    >
                        <SearchBar onSearch={setSearchQuery} />
                        <FilterPanel onFilterChange={handleFilterChange} />
                    </motion.div>

                    <div className="mt-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-emerald-600 border-solid"></div>
                                <span className="ml-3 text-emerald-600 font-medium">Đang tải dữ liệu...</span>
                            </div>
                        ) : error ? (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-600 text-center bg-red-50 p-4 rounded-lg"
                            >
                                {error}
                            </motion.p>
                        ) : filteredDocuments.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <p className="text-sm text-gray-500 mb-2">
                                    🔎 {filteredDocuments.length} tài liệu phù hợp với từ khóa
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredDocuments.map((doc, index) => (
                                        <motion.div
                                            key={doc.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <DocumentCard document={doc} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-gray-500 mt-10"
                            >
                                Không tìm thấy tài liệu phù hợp.
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
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

                @keyframes floatIcon {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                    }
                    25% {
                        transform: translate(15px, -15px) rotate(10deg) scale(1.1);
                    }
                    50% {
                        transform: translate(-5px, 15px) rotate(-8deg) scale(0.95);
                    }
                    75% {
                        transform: translate(-15px, -5px) rotate(5deg) scale(1.05);
                    }
                }

                .animate-float-slow {
                    animation: float 20s ease-in-out infinite;
                }

                .animate-float-medium {
                    animation: float 15s ease-in-out infinite;
                }

                .animate-float-fast {
                    animation: float 10s ease-in-out infinite;
                }

                .animate-float-icon-1 {
                    animation: floatIcon 12s ease-in-out infinite;
                }

                .animate-float-icon-2 {
                    animation: floatIcon 14s ease-in-out infinite;
                    animation-delay: -3s;
                }

                .animate-float-icon-3 {
                    animation: floatIcon 16s ease-in-out infinite;
                    animation-delay: -6s;
                }

                .animate-float-icon-4 {
                    animation: floatIcon 18s ease-in-out infinite;
                    animation-delay: -2s;
                }

                .animate-float-icon-5 {
                    animation: floatIcon 20s ease-in-out infinite;
                    animation-delay: -7s;
                }

                .animate-float-icon-6 {
                    animation: floatIcon 22s ease-in-out infinite;
                    animation-delay: -4s;
                }

                .animate-float-icon-7 {
                    animation: floatIcon 19s ease-in-out infinite;
                    animation-delay: -5s;
                }

                .animate-float-icon-8 {
                    animation: floatIcon 21s ease-in-out infinite;
                    animation-delay: -8s;
                }

                .animate-float-icon-9 {
                    animation: floatIcon 17s ease-in-out infinite;
                    animation-delay: -3.5s;
                }

                .animate-float-icon-10 {
                    animation: floatIcon 23s ease-in-out infinite;
                    animation-delay: -6.5s;
                }

                @media (max-width: 768px) {
                    [class*="animate-float-icon"] {
                        transform: scale(0.8);
                    }
                }

                @media (max-width: 480px) {
                    [class*="animate-float-icon"] {
                        transform: scale(0.6);
                    }
                }

                * {
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default SearchPage;
