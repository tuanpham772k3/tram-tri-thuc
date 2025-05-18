import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox } from "antd";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/Auth/FormInput";
import { login } from "../../store/slices/authSlice";

const Login = () => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token, user, needsVerification } = useSelector((state) => state.auth);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember: false,
            showPassword: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            const { email, password } = values;
            await dispatch(login({ email, password }));
        },
    });

    // Theo dõi token và error để chuyển hướng
    useEffect(() => {
        if (token && user) {
            navigate("/");
        } else if (error && needsVerification) {
            navigate("/auth/verify");
        }
    }, [token, user, navigate, needsVerification, error]);

    // Hàm xử lý đăng nhập bằng Google
    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        window.location.href = "http://localhost:5000/api/v1/auth/google";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Đăng nhập vào tài khoản của bạn
                </h2>
                {error && (
                    <p className="text-red-500 text-center">
                        {error === "Email not verified. Please verify your email before logging in."
                            ? "Email chưa được xác minh. Vui lòng kiểm tra email để xác thực."
                            : error}
                    </p>
                )}
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <FormInput formik={formik} name="email" placeholder="Email" icon={FaEnvelope} />
                    <FormInput
                        formik={formik}
                        name="password"
                        type="password"
                        placeholder="Mật khẩu"
                        icon={FaLock}
                        isPassword
                    />
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <Checkbox
                            name="remember"
                            checked={formik.values.remember}
                            onChange={formik.handleChange}
                        >
                            Ghi nhớ đăng nhập
                        </Checkbox>
                        <Link to={"/auth/forgot-password"} className="text-blue-500">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <Button
                        type="primary"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        htmlType="submit"
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>
                </form>
                {/* Nút đăng nhập bằng Google */}
                <Button
                    onClick={handleGoogleLogin}
                    loading={isGoogleLoading}
                    className="w-full mt-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google Logo"
                        className="w-5 h-5"
                    />
                    Đăng nhập bằng Google
                </Button>
                <p className="text-center text-sm text-gray-600 mt-2">
                    Chưa có tài khoản?{" "}
                    <Link to={"/auth/register"} className="text-blue-500">
                        Đăng ký ngay
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
