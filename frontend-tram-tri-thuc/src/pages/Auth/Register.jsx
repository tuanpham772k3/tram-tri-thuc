import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox } from "antd";
import { FaEnvelope, FaLock, FaUser, FaHandPointRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/Auth/FormInput";
import { registerThunk, resetAuthState } from "../../store/slices/authSlice";

const Register = () => {
    const [sparkles, setSparkles] = useState([]);
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

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

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            agree: false,
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, "Tên phải có ít nhất 3 ký tự")
                .max(50, "Tên không được vượt quá 50 ký tự")
                .required("Vui lòng nhập họ tên"),
            email: Yup.string()
                .email("Email không hợp lệ")
                .required("Vui lòng nhập email"),
            password: Yup.string()
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
                .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ in hoa")
                .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
                .required("Vui lòng nhập mật khẩu"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
                .required("Vui lòng xác nhận mật khẩu"),
            agree: Yup.boolean()
                .oneOf([true], "Bạn phải đồng ý với điều khoản sử dụng")
                .required(),
        }),
        onSubmit: async (values) => {
            const { name, email, password } = values;
            await dispatch(registerThunk({ name, email, password }));
        },
    });

    useEffect(() => {
        return () => {
            dispatch(resetAuthState());
        };
    }, [dispatch]);

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

            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/50 via-green-500/50 to-lime-500/50 backdrop-blur-sm"></div>
            <div className="min-h-screen w-screen flex flex-col md:flex-row relative z-10">
                {/* Left side - Welcome Content */}
                <div className="md:w-1/2 flex items-center justify-center p-8 text-white min-h-screen">
                    <div className="max-w-xl w-full">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                            Tham Gia Ngay
                            <span className="block text-xl md:text-2xl mt-2 font-normal">
                                Khám Phá Kho Tàng Tri Thức
                            </span>
                        </h1>
                        
                        <div className="space-y-6 mt-12">
                            {[0, 1, 2].map((index) => (
                                <div
                                    key={index}
                                    onClick={(e) => createSparkles(e, index)}
                                    className="group relative flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm hover:bg-white/20 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-white/10 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-green-500/0 to-lime-500/0 group-hover:from-emerald-500/10 group-hover:via-green-500/10 group-hover:to-lime-500/10 transition-all duration-500"></div>
                                    
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            )}
                                            {index === 1 && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            )}
                                            {index === 2 && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            )}
                                        </svg>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="font-semibold text-lg group-hover:text-white transition-colors duration-300">
                                            {index === 0 && "Tạo tài khoản miễn phí"}
                                            {index === 1 && "Truy cập không giới hạn"}
                                            {index === 2 && "Cộng đồng lớn mạnh"}
                                        </h3>
                                        <p className="text-white/80 group-hover:text-white transition-colors duration-300">
                                            {index === 0 && "Chỉ vài bước đơn giản"}
                                            {index === 1 && "Kho tài liệu đa dạng, phong phú"}
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

                {/* Right side - Register Form */}
                <div className="md:w-1/2 flex items-center justify-center p-4 md:p-8 min-h-screen bg-white/10 backdrop-blur-md">
                    <div className="w-full max-w-md">
                        <div className="bg-white/90 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-lg border border-white/20">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                                    Đăng Ký Tài Khoản
                                </h2>
                                <p className="text-gray-600 mt-2">Tạo tài khoản để bắt đầu</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
                                    <p className="text-red-600 text-sm text-center">{error}</p>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={formik.handleSubmit}>
                                <div className="space-y-4">
                                    <FormInput
                                        formik={formik}
                                        name="name"
                                        placeholder="Họ và tên"
                                        icon={FaUser}
                                        className="transition-all duration-200 focus-within:ring-2 focus-within:ring-green-500 rounded-xl"
                                        inputClassName="rounded-xl border-gray-200 focus:border-green-500 py-3"
                                    />
                                    <FormInput
                                        formik={formik}
                                        name="email"
                                        placeholder="Email"
                                        icon={FaEnvelope}
                                        className="transition-all duration-200 focus-within:ring-2 focus-within:ring-green-500 rounded-xl"
                                        inputClassName="rounded-xl border-gray-200 focus:border-green-500 py-3"
                                    />
                                    <FormInput
                                        formik={formik}
                                        name="password"
                                        type="password"
                                        placeholder="Mật khẩu"
                                        icon={FaLock}
                                        isPassword
                                        className="transition-all duration-200 focus-within:ring-2 focus-within:ring-green-500 rounded-xl"
                                        inputClassName="rounded-xl border-gray-200 focus:border-green-500 py-3"
                                    />
                                    <FormInput
                                        formik={formik}
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Xác nhận mật khẩu"
                                        icon={FaLock}
                                        isPassword
                                        className="transition-all duration-200 focus-within:ring-2 focus-within:ring-green-500 rounded-xl"
                                        inputClassName="rounded-xl border-gray-200 focus:border-green-500 py-3"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Checkbox
                                        name="agree"
                                        checked={formik.values.agree}
                                        onChange={formik.handleChange}
                                        className="text-gray-600 hover:text-green-600"
                                    >
                                        <span className="text-gray-600">
                                            Tôi đồng ý với{" "}
                                            <Link to="#" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                                                điều khoản sử dụng
                                            </Link>
                                        </span>
                                    </Checkbox>
                                    {formik.touched.agree && formik.errors.agree && (
                                        <p className="text-red-500 text-xs">{formik.errors.agree}</p>
                                    )}
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
                                </Button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            Hoặc đăng ký với
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-full p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-green-200 hover:shadow-md"
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
                                        className="flex items-center justify-center w-full p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-green-200 hover:shadow-md"
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
                                    Đã có tài khoản?{" "}
                                    <Link to="/auth/login" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                                        Đăng nhập
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

export default Register;
