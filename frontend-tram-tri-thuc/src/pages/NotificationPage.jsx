import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    FaBook, FaGraduationCap, FaPencilAlt, FaLightbulb, FaBrain, 
    FaChalkboardTeacher, FaBookReader, FaAtom, FaUniversity, FaUserGraduate,
    FaSchool, FaBookOpen, FaDesktop, FaCalculator,
    FaAward, FaFlask, FaMicroscope, FaGlobe
} from "react-icons/fa";

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
                            top: '25%', 
                            left: '30%',
                            animation: 'float 19s ease-in-out infinite',
                            animationDelay: '-6s'
                        }}
                    >
                        <FaAtom className="w-12 h-12" />
                    </div>
                    <div 
                        className="absolute text-purple-500 opacity-30"
                        style={{ 
                            bottom: '30%', 
                            right: '35%',
                            animation: 'float 21s ease-in-out infinite',
                            animationDelay: '-3s'
                        }}
                    >
                        <FaFlask className="w-10 h-10" />
                    </div>
                    <div 
                        className="absolute text-green-500 opacity-30"
                        style={{ 
                            top: '45%', 
                            left: '25%',
                            animation: 'float 17s ease-in-out infinite',
                            animationDelay: '-8s'
                        }}
                    >
                        <FaGlobe className="w-16 h-16" />
                    </div>
                    <div 
                        className="absolute text-yellow-500 opacity-30"
                        style={{ 
                            bottom: '25%', 
                            left: '20%',
                            animation: 'float 23s ease-in-out infinite',
                            animationDelay: '-5s'
                        }}
                    >
                        <FaLightbulb className="w-8 h-8" />
                    </div>
                    <div 
                        className="absolute text-red-500 opacity-30"
                        style={{ 
                            top: '55%', 
                            right: '15%',
                            animation: 'float 20s ease-in-out infinite',
                            animationDelay: '-9s'
                        }}
                    >
                        <FaUniversity className="w-12 h-12" />
                    </div>
                    <div 
                        className="absolute text-indigo-500 opacity-30"
                        style={{ 
                            top: '15%', 
                            right: '45%',
                            animation: 'float 24s ease-in-out infinite',
                            animationDelay: '-11s'
                        }}
                    >
                        <FaBookReader className="w-10 h-10" />
                    </div>
                    <div 
                        className="absolute text-pink-500 opacity-30"
                        style={{ 
                            bottom: '45%', 
                            right: '20%',
                            animation: 'float 19s ease-in-out infinite',
                            animationDelay: '-7s'
                        }}
                    >
                        <FaCalculator className="w-9 h-9" />
                    </div>
                    <div 
                        className="absolute text-orange-500 opacity-30"
                        style={{ 
                            top: '70%', 
                            left: '35%',
                            animation: 'float 21s ease-in-out infinite',
                            animationDelay: '-4s'
                        }}
                    >
                        <FaMicroscope className="w-11 h-11" />
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Thông báo</h2>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
                        <ul className="space-y-3">
                            {notifications.map((noti) => (
                                <motion.li
                                    key={noti.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className={`p-4 rounded-lg shadow-sm transition-all hover:shadow-md
                                        ${noti.isRead ? "bg-gray-50/80" : "bg-blue-50/80 border-l-4 border-blue-500"}`}
                                >
                                    <Link to={noti.link} className="text-gray-700 hover:text-blue-600 transition-colors">
                                        {noti.content}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>

            {/* Animation Styles */}
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
};

export default NotificationPage;
