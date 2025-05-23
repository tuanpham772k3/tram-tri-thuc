import UploadForm from "../../components/Uploader/UploadForm";
import { motion } from "framer-motion";
import { 
    FaBook, FaGraduationCap, FaPencilAlt, FaLightbulb, FaBrain, 
    FaChalkboardTeacher, FaBookReader, FaAtom, FaUniversity, FaUserGraduate,
    FaSchool, FaBookOpen, FaDesktop, FaCalculator,
    FaAward, FaFlask, FaMicroscope, FaGlobe
} from "react-icons/fa";

const UploadPage = () => {
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
            
            {/* Particle Effect Layer */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="particles">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                '--particle-size': `${Math.random() * 3 + 1}px`,
                                '--particle-delay': `${Math.random() * 5}s`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        />
                    ))}
                </div>
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
                            animation: 'float 20s ease-in-out infinite'
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
                            animation: 'float 15s ease-in-out infinite',
                            animationDelay: '-5s'
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
                            animation: 'float 10s ease-in-out infinite',
                            animationDelay: '-7s'
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
                    
                    {/* New Icons */}
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

                    {/* Additional New Icons */}
                    <div 
                        className="absolute text-rose-500 opacity-30 animate-float-icon-11"
                        style={{ top: '15%', right: '55%' }}
                    >
                        <FaSchool className="w-13 h-13" />
                    </div>
                    <div 
                        className="absolute text-amber-500 opacity-30 animate-float-icon-12"
                        style={{ bottom: '45%', right: '10%' }}
                    >
                        <FaBookOpen className="w-15 h-15" />
                    </div>
                    <div 
                        className="absolute text-sky-500 opacity-30 animate-float-icon-13"
                        style={{ top: '70%', left: '55%' }}
                    >
                        <FaDesktop className="w-12 h-12" />
                    </div>
                    <div 
                        className="absolute text-lime-500 opacity-30 animate-float-icon-14"
                        style={{ bottom: '15%', left: '10%' }}
                    >
                        <FaCalculator className="w-10 h-10" />
                    </div>

                    {/* Corner Icons */}
                    <div 
                        className="absolute text-yellow-500 opacity-40 animate-float-icon-corner-1"
                        style={{ top: '5%', left: '5%' }}
                    >
                        <FaAward className="w-16 h-16 transform hover:scale-110 transition-transform" />
                    </div>
                    <div 
                        className="absolute text-pink-500 opacity-40 animate-float-icon-corner-2"
                        style={{ top: '5%', right: '5%' }}
                    >
                        <FaFlask className="w-16 h-16 transform hover:scale-110 transition-transform" />
                    </div>
                    <div 
                        className="absolute text-violet-500 opacity-40 animate-float-icon-corner-3"
                        style={{ bottom: '5%', left: '5%' }}
                    >
                        <FaMicroscope className="w-16 h-16 transform hover:scale-110 transition-transform" />
                    </div>
                    <div 
                        className="absolute text-blue-500 opacity-40 animate-float-icon-corner-4"
                        style={{ bottom: '5%', right: '5%' }}
                    >
                        <FaGlobe className="w-16 h-16 transform hover:scale-110 transition-transform" />
                    </div>
                </div>

                {/* Decorative Grid */}
                <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Content with enhanced motion */}
            <div className="relative z-10 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.8,
                        ease: [0.6, -0.05, 0.01, 0.99]
                    }}
                    className="max-w-4xl mx-auto px-4"
                >
                    <motion.h1 
                        className="text-4xl font-bold text-gray-800 mb-6 text-center"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut"
                        }}
                    >
                        Đăng tài liệu mới
                    </motion.h1>
                    <UploadForm />
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

                .animate-float-icon-11 {
                    animation: floatIcon 24s ease-in-out infinite;
                    animation-delay: -4.5s;
                }

                .animate-float-icon-12 {
                    animation: floatIcon 25s ease-in-out infinite;
                    animation-delay: -7.5s;
                }

                .animate-float-icon-13 {
                    animation: floatIcon 22s ease-in-out infinite;
                    animation-delay: -5.5s;
                }

                .animate-float-icon-14 {
                    animation: floatIcon 26s ease-in-out infinite;
                    animation-delay: -8.5s;
                }

                /* Add a new variation of the float animation for more diversity */
                @keyframes floatIconAlt {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                    }
                    33% {
                        transform: translate(20px, -25px) rotate(12deg) scale(1.15);
                    }
                    66% {
                        transform: translate(-15px, 20px) rotate(-10deg) scale(0.9);
                    }
                }

                /* Apply the new animation to some of the new icons */
                .animate-float-icon-11, .animate-float-icon-13 {
                    animation-name: floatIconAlt;
                }

                @keyframes floatCorner {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                        filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
                    }
                    25% {
                        transform: translate(10px, 10px) rotate(5deg) scale(1.1);
                        filter: drop-shadow(0 0 15px rgba(255,255,255,0.7));
                    }
                    50% {
                        transform: translate(-5px, 15px) rotate(-5deg) scale(0.95);
                        filter: drop-shadow(0 0 20px rgba(255,255,255,0.6));
                    }
                    75% {
                        transform: translate(-10px, -5px) rotate(3deg) scale(1.05);
                        filter: drop-shadow(0 0 12px rgba(255,255,255,0.4));
                    }
                }

                .animate-float-icon-corner-1 {
                    animation: floatCorner 15s ease-in-out infinite;
                    animation-delay: -2s;
                }

                .animate-float-icon-corner-2 {
                    animation: floatCorner 15s ease-in-out infinite;
                    animation-delay: -5.5s;
                }

                .animate-float-icon-corner-3 {
                    animation: floatCorner 15s ease-in-out infinite;
                    animation-delay: -8.5s;
                }

                .animate-float-icon-corner-4 {
                    animation: floatCorner 15s ease-in-out infinite;
                    animation-delay: -11.5s;
                }

                /* Add hover effect styles */
                .animate-float-icon-corner-1:hover,
                .animate-float-icon-corner-2:hover,
                .animate-float-icon-corner-3:hover,
                .animate-float-icon-corner-4:hover {
                    filter: drop-shadow(0 0 25px rgba(255,255,255,0.8));
                    transition: filter 0.3s ease;
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

                /* Enhanced Corner Icon Animations */
                .animate-float-icon-corner-1,
                .animate-float-icon-corner-2,
                .animate-float-icon-corner-3,
                .animate-float-icon-corner-4 {
                    transition: all 0.3s ease;
                }

                .animate-float-icon-corner-1:hover,
                .animate-float-icon-corner-2:hover,
                .animate-float-icon-corner-3:hover,
                .animate-float-icon-corner-4:hover {
                    filter: drop-shadow(0 0 25px rgba(255,255,255,0.8));
                    transform: scale(1.15) rotate(5deg);
                    cursor: pointer;
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
                    [class*="animate-float-icon-corner"] {
                        transform: scale(0.6);
                    }
                }

                /* Add smooth transitions for all animations */
                * {
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default UploadPage;
