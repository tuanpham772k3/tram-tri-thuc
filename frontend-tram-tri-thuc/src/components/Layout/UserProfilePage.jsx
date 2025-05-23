import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    FaUser, FaDownload, FaHeart, FaEye, 
    FaGraduationCap, FaBook, FaBrain, FaLightbulb,
    FaAtom, FaUniversity, FaUserGraduate, FaSchool,
    FaBookOpen, FaDesktop, FaCalculator, FaAward,
    FaFlask, FaMicroscope, FaGlobe, FaChalkboardTeacher
} from "react-icons/fa";

const tabs = [
    { to: "/user/profile", label: "Thông tin", end: true, icon: FaUser },
    { to: "downloads", label: "Đã tải", icon: FaDownload },
    { to: "favorites", label: "Yêu thích", icon: FaHeart },
    { to: "views", label: "Đã xem", icon: FaEye },
];

export default function UserProfilePage() {
    return (
        <div className="min-h-screen relative -mt-16">
            {/* Background Base */}
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
                {/* Floating Circles and Icons */}
                <div className="absolute w-full h-full">
                    {/* Top Left Group */}
                    <div 
                        className="absolute w-96 h-96 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-slow"
                        style={{
                            top: '2%',
                            left: '2%',
                            animation: 'float 20s ease-in-out infinite'
                        }}
                    />
                    <div className="absolute text-emerald-600 opacity-50 animate-float-icon-1"
                        style={{ top: '5%', left: '5%' }}>
                        <FaGraduationCap className="w-20 h-20" />
                    </div>
                    <div className="absolute text-emerald-500 opacity-40 animate-float-icon-2"
                        style={{ top: '15%', left: '15%' }}>
                        <FaUniversity className="w-16 h-16" />
                    </div>

                    {/* Top Right Group */}
                    <div 
                        className="absolute w-80 h-80 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-medium"
                        style={{
                            top: '5%',
                            right: '2%',
                            animation: 'float 18s ease-in-out infinite',
                            animationDelay: '-3s'
                        }}
                    />
                    <div className="absolute text-teal-600 opacity-50 animate-float-icon-3"
                        style={{ top: '8%', right: '5%' }}>
                        <FaBook className="w-16 h-16" />
                    </div>
                    <div className="absolute text-teal-500 opacity-40 animate-float-icon-4"
                        style={{ top: '18%', right: '15%' }}>
                        <FaBookOpen className="w-14 h-14" />
                    </div>

                    {/* Middle Left Group */}
                    <div 
                        className="absolute w-72 h-72 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-fast"
                        style={{
                            top: '35%',
                            left: '15%',
                            animation: 'float 15s ease-in-out infinite',
                            animationDelay: '-5s'
                        }}
                    />
                    <div className="absolute text-cyan-600 opacity-50 animate-float-icon-5"
                        style={{ top: '38%', left: '18%' }}>
                        <FaBrain className="w-14 h-14" />
                    </div>
                    <div className="absolute text-cyan-500 opacity-40 animate-float-icon-6"
                        style={{ top: '45%', left: '25%' }}>
                        <FaAtom className="w-12 h-12" />
                    </div>

                    {/* Middle Right Group */}
                    <div 
                        className="absolute w-64 h-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-medium"
                        style={{
                            top: '35%',
                            right: '15%',
                            animation: 'float 16s ease-in-out infinite',
                            animationDelay: '-7s'
                        }}
                    />
                    <div className="absolute text-blue-600 opacity-50 animate-float-icon-7"
                        style={{ top: '38%', right: '18%' }}>
                        <FaLightbulb className="w-12 h-12" />
                    </div>
                    <div className="absolute text-blue-500 opacity-40 animate-float-icon-8"
                        style={{ top: '45%', right: '25%' }}>
                        <FaCalculator className="w-10 h-10" />
                    </div>

                    {/* Bottom Left Group */}
                    <div 
                        className="absolute w-80 h-80 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-slow"
                        style={{
                            bottom: '5%',
                            left: '2%',
                            animation: 'float 19s ease-in-out infinite',
                            animationDelay: '-4s'
                        }}
                    />
                    <div className="absolute text-violet-600 opacity-50 animate-float-icon-9"
                        style={{ bottom: '8%', left: '5%' }}>
                        <FaFlask className="w-16 h-16" />
                    </div>
                    <div className="absolute text-violet-500 opacity-40 animate-float-icon-10"
                        style={{ bottom: '18%', left: '15%' }}>
                        <FaMicroscope className="w-14 h-14" />
                    </div>

                    {/* Bottom Right Group */}
                    <div 
                        className="absolute w-76 h-76 bg-gradient-to-r from-fuchsia-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-extra"
                        style={{
                            bottom: '5%',
                            right: '2%',
                            animation: 'float 17s ease-in-out infinite',
                            animationDelay: '-6s'
                        }}
                    />
                    <div className="absolute text-fuchsia-600 opacity-50 animate-float-icon-11"
                        style={{ bottom: '8%', right: '5%' }}>
                        <FaGlobe className="w-16 h-16" />
                    </div>
                    <div className="absolute text-fuchsia-500 opacity-40 animate-float-icon-12"
                        style={{ bottom: '18%', right: '15%' }}>
                        <FaChalkboardTeacher className="w-14 h-14" />
                    </div>

                    {/* Center Icons - Positioned in a triangle */}
                    <div className="absolute text-green-600 opacity-30 animate-float-icon-13"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <FaUserGraduate className="w-24 h-24" />
                    </div>
                    <div className="absolute text-green-500 opacity-20 animate-float-icon-14"
                        style={{ top: '40%', left: '45%' }}>
                        <FaSchool className="w-20 h-20" />
                    </div>
                    <div className="absolute text-green-400 opacity-20 animate-float-icon-15"
                        style={{ top: '40%', left: '55%' }}>
                        <FaAward className="w-16 h-16" />
                    </div>
                </div>

                {/* Particle Effect - Adjusted to avoid crowding */}
                <div className="particles">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                '--particle-size': `${Math.random() * 2 + 1}px`,
                                '--particle-delay': `${Math.random() * 8}s`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 pt-16 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                        👤 Hồ sơ cá nhân
                    </h2>

                    <nav className="flex flex-wrap gap-4 justify-center mb-8">
                        {tabs.map(({ to, label, end, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                                    ${isActive
                                        ? "bg-green-500 text-white shadow-lg shadow-green-200"
                                        : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md"
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20">
                        <Outlet />
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
                    33% {
                        transform: translate(15px, -15px) rotate(10deg) scale(1.1);
                    }
                    66% {
                        transform: translate(-10px, 15px) rotate(-8deg) scale(0.95);
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

                .animate-float-extra {
                    animation: float 18s ease-in-out infinite;
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
                    animation-delay: -4s;
                }

                .animate-float-icon-5 {
                    animation: floatIcon 15s ease-in-out infinite;
                    animation-delay: -2s;
                }

                .animate-float-icon-6 {
                    animation: floatIcon 14s ease-in-out infinite;
                    animation-delay: -5s;
                }

                .animate-float-icon-7 {
                    animation: floatIcon 16s ease-in-out infinite;
                    animation-delay: -3s;
                }

                .animate-float-icon-8 {
                    animation: floatIcon 13s ease-in-out infinite;
                    animation-delay: -7s;
                }

                .animate-float-icon-9 {
                    animation: floatIcon 17s ease-in-out infinite;
                    animation-delay: -4s;
                }

                .animate-float-icon-10 {
                    animation: floatIcon 15s ease-in-out infinite;
                    animation-delay: -6s;
                }

                .animate-float-icon-11 {
                    animation: floatIcon 14s ease-in-out infinite;
                    animation-delay: -3s;
                }

                .animate-float-icon-12 {
                    animation: floatIcon 16s ease-in-out infinite;
                    animation-delay: -5s;
                }

                .animate-float-icon-13 {
                    animation: floatIcon 20s ease-in-out infinite;
                    animation-delay: -2s;
                }

                .animate-float-icon-14 {
                    animation: floatIcon 18s ease-in-out infinite;
                    animation-delay: -4s;
                }

                .animate-float-icon-15 {
                    animation: floatIcon 16s ease-in-out infinite;
                    animation-delay: -6s;
                }

                /* Particle Animation */
                .particles {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                }

                .particle {
                    position: absolute;
                    width: var(--particle-size);
                    height: var(--particle-size);
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    animation: particleFloat 8s ease-in-out infinite;
                    animation-delay: var(--particle-delay);
                }

                @keyframes particleFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0;
                    }
                    25% {
                        transform: translate(50px, -30px) scale(1.2);
                        opacity: 0.6;
                    }
                    50% {
                        transform: translate(100px, 0) scale(0.8);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translate(50px, 30px) scale(1.1);
                        opacity: 0.2;
                    }
                }

                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .particle {
                        display: none;
                    }
                    
                    [class*="animate-float-icon"] {
                        transform: scale(0.8);
                    }
                }

                @media (max-width: 480px) {
                    [class*="animate-float-icon"] {
                        transform: scale(0.6);
                    }
                }
            `}</style>
        </div>
    );
}
