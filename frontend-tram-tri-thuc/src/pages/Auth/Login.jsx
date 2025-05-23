import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox } from "antd";
import { FaEnvelope, FaLock, FaHandPointRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/Auth/FormInput";
import { clearAuthState, loginThunk } from "../../store/slices/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const { userInfo } = useSelector((state) => state.user);
    const [clickedCard, setClickedCard] = useState(null);
    const [sparkles, setSparkles] = useState([]);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
            password: Yup.string()
                .min(6, "Mật khẩu tối thiểu 6 ký tự")
                .required("Vui lòng nhập mật khẩu"),
        }),
        onSubmit: async ({ email, password, remember }) => {
            await dispatch(loginThunk({ email, password, remember }));
        },
    });

    useEffect(() => {
        if (isAuthenticated && userInfo) {
            navigate("/");
        }
    }, [isAuthenticated, navigate, userInfo]);

    useEffect(() => {
        return () => {
            dispatch(clearAuthState());
        };
    }, [dispatch]);

    const handleCardClick = (index) => {
        setClickedCard(index);
        setTimeout(() => setClickedCard(null), 1000);
    };

    const createSparkles = (e, cardIndex) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = e.clientX - rect.left;
        const centerY = e.clientY - rect.top;

        // Tạo 50 sparkles mới với vị trí và góc ngẫu nhiên
        const newSparkles = Array.from({ length: 50 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 50;
            const velocity = 2 + Math.random() * 4; // Tốc độ ngẫu nhiên
            const size = 3 + Math.random() * 3; // Kích thước ngẫu nhiên
            const distance = 30 + Math.random() * 60; // Khoảng cách ngẫu nhiên
            
            return {
                id: `${cardIndex}-${i}-${Date.now()}`,
                x: centerX,
                y: centerY,
                targetX: centerX + Math.cos(angle) * distance,
                targetY: centerY + Math.sin(angle) * distance,
                size,
                velocity,
                cardIndex
            };
        });

        setSparkles(prev => [...prev, ...newSparkles]);
        setTimeout(() => {
            setSparkles(prev => prev.filter(s => !newSparkles.includes(s)));
        }, 1000);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <style jsx>{`
                @keyframes sparkle {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx), var(--ty)) scale(0);
                        opacity: 0;
                    }
                }
                .sparkle {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 100;
                    animation: sparkle 600ms ease-out forwards;
                }
                .sparkle::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.8);
                }
            `}</style>

            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50 backdrop-blur-sm"></div>
            <div className="min-h-screen w-screen flex flex-col md:flex-row relative z-10">
                {/* Left side - Welcome Content */}
                <div className="md:w-1/2 flex items-center justify-center p-8 text-white min-h-screen">
                    <div className="max-w-xl w-full">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                            Kho Tàng Tri Thức
                            <span className="block text-xl md:text-2xl mt-2 font-normal">
                                Nơi Chia Sẻ & Khám Phá
                            </span>
                        </h1>
                        
                        <div className="space-y-6 mt-12">
                            {[0, 1, 2].map((index) => (
                                <div
                                    key={index}
                                    onClick={(e) => createSparkles(e, index)}
                                    className="group relative flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm hover:bg-white/20 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-white/10 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                                    
                                    {sparkles.filter(s => s.cardIndex === index).map(sparkle => (
                                        <div
                                            key={sparkle.id}
                                            className="sparkle"
                                            style={{
                                                left: `${sparkle.x}px`,
                                                top: `${sparkle.y}px`,
                                                width: `${sparkle.size}px`,
                                                height: `${sparkle.size}px`,
                                                '--tx': `${sparkle.targetX - sparkle.x}px`,
                                                '--ty': `${sparkle.targetY - sparkle.y}px`,
                                            }}
                                        />
                                    ))}

                                    <div className="flex-shrink-0 relative z-10">
                                        <svg className="w-8 h-8 transform group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {index === 0 && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            )}
                                            {index === 1 && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            )}
                                            {index === 2 && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            )}
                                        </svg>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="font-semibold text-lg group-hover:text-white transition-colors duration-300">
                                            {index === 0 && "Truy cập không giới hạn"}
                                            {index === 1 && "Tải xuống nhanh chóng"}
                                            {index === 2 && "Cộng đồng sôi nổi"}
                                        </h3>
                                        <p className="text-white/80 group-hover:text-white transition-colors duration-300">
                                            {index === 0 && "Kho tài liệu đa dạng, phong phú"}
                                            {index === 1 && "Không giới hạn tốc độ tải xuống"}
                                            {index === 2 && "Kết nối và chia sẻ kiến thức"}
                                        </p>
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                                        <FaHandPointRight className="w-6 h-6 text-white animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="md:w-1/2 flex items-center justify-center p-4 md:p-8 min-h-screen bg-white/10 backdrop-blur-md">
                    <div className="w-full max-w-md">
                        <div className="bg-white/90 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-lg border border-white/20">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                    Đăng Nhập
                                </h2>
                                <p className="text-gray-600 mt-2">Chào mừng bạn quay trở lại!</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
                                    <p className="text-red-600 text-sm text-center">
                                        {error.includes("304")
                                            ? "Lỗi server: Response 304 bất thường. Vui lòng thử lại hoặc liên hệ hỗ trợ."
                                            : error ===
                                              "Email not verified. Please verify your email before logging in."
                                            ? "Email chưa được xác minh. Vui lòng kiểm tra email để xác thực."
                                            : error}
                                    </p>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={formik.handleSubmit}>
                                <div className="space-y-4">
                                    <FormInput
                                        formik={formik}
                                        name="email"
                                        placeholder="Email của bạn"
                                        icon={FaEnvelope}
                                        className="transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500 rounded-xl"
                                        inputClassName="rounded-xl border-gray-200 focus:border-purple-500 py-3"
                                    />
                                    <FormInput
                                        formik={formik}
                                        name="password"
                                        type="password"
                                        placeholder="Mật khẩu"
                                        icon={FaLock}
                                        isPassword
                                        className="transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500 rounded-xl"
                                        inputClassName="rounded-xl border-gray-200 focus:border-purple-500 py-3"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <Checkbox
                                        name="remember"
                                        checked={formik.values.remember}
                                        onChange={formik.handleChange}
                                        className="text-gray-600 hover:text-purple-600"
                                    >
                                        <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                                    </Checkbox>
                                    <Link 
                                        to="/auth/forgot-password" 
                                        className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                                </Button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            Hoặc đăng nhập với
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-full p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-purple-200 hover:shadow-md"
                                    >
                                        <img
                                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                                            alt="Google"
                                            className="w-5 h-5 mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-600">Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-full p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-purple-200 hover:shadow-md"
                                    >
                                        <img
                                            src="https://www.svgrepo.com/show/448234/facebook.svg"
                                            alt="Facebook"
                                            className="w-5 h-5 mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-600">Facebook</span>
                                    </button>
                                </div>

                                <p className="text-center text-gray-600 text-sm mt-8">
                                    Chưa có tài khoản?{" "}
                                    <Link to="/auth/register" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;