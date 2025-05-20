import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox } from "antd";
import { FaEnvelope, FaLock } from "react-icons/fa";
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
        onSubmit: async ({ email, password, remember }) => {
            await dispatch(loginThunk({ email, password, remember }));
        },
    });

    // Theo dõi token và error để chuyển hướng
    useEffect(() => {
        if (isAuthenticated && userInfo) {
            navigate("/");
        }
    }, [isAuthenticated, navigate, userInfo]);

    // Clear error khi rời khỏi trang login
    useEffect(() => {
        return () => {
            dispatch(clearAuthState());
        };
    }, [dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Đăng nhập vào tài khoản của bạn
                </h2>
                {error && (
                    <p className="text-red-500 text-center">
                        {error.includes("304")
                            ? "Lỗi server: Response 304 bất thường. Vui lòng thử lại hoặc liên hệ hỗ trợ."
                            : error ===
                                "Email not verified. Please verify your email before logging in."
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
