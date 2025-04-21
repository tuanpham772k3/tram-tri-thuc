import React, { useEffect } from "react";
import { Button, Card, Input, Checkbox } from "antd";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

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
        if (token) {
            navigate("/home");
        }
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Đăng nhập vào tài khoản của bạn
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div>
                        <Input
                            prefix={<FaEnvelope className="text-gray-500" />}
                            placeholder="Email"
                            type="email"
                            className="h-10"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            prefix={<FaLock className="text-gray-500" />}
                            type={formik.values.showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            className="h-10"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            suffix={
                                <span
                                    className="cursor-pointer text-gray-500"
                                    onClick={() =>
                                        formik.setFieldValue(
                                            "showPassword",
                                            !formik.values.showPassword
                                        )
                                    }
                                >
                                    {formik.values.showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            }
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                        )}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <Checkbox
                            name="remember"
                            checked={formik.values.remember}
                            onChange={formik.handleChange}
                        >
                            Ghi nhớ đăng nhập
                        </Checkbox>
                        <Link to={"/forgot-password"} className="text-blue-500">
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
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Chưa có tài khoản?{" "}
                        <Link to={"/register"} className="text-blue-500">
                            Đăng ký ngay
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Login;
