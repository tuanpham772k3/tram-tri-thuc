import { Button, Card, Checkbox, Input } from "antd";
import React from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../redux/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

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
                .min(3, "Name must be at least 3 characters")
                .max(50, "Name must be at most 50 characters")
                .required("Name is required"),
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
            agree: Yup.boolean().oneOf([true], "You must agree to the terms of use").required(),
        }),
        onSubmit: async (values) => {
            const { name, email, password } = values;
            await dispatch(register({ name, email, password }));
            if (!error) {
                navigate("/login");
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Tạo tài khoản để quản lý tài liệu của bạn
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div>
                        <Input
                            prefix={<FaUser className="text-gray-500" />}
                            placeholder="Họ và tên"
                            className="h-10"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                        )}
                    </div>
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
                    <div>
                        <Input
                            prefix={<FaLock className="text-gray-500" />}
                            type={formik.values.showConfirmPassword ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu"
                            className="h-10"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            suffix={
                                <span
                                    className="cursor-pointer text-gray-500"
                                    onClick={() =>
                                        formik.setFieldValue(
                                            "showConfirmPassword",
                                            !formik.values.showConfirmPassword
                                        )
                                    }
                                >
                                    {formik.values.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            }
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {formik.errors.confirmPassword}
                            </p>
                        )}
                    </div>
                    <Checkbox
                        name="agree"
                        checked={formik.values.agree}
                        onChange={formik.handleChange}
                        className="text-sm text-gray-600"
                    >
                        Tôi đồng ý với{" "}
                        <a href="#" className="text-blue-500">
                            điều khoản sử dụng
                        </a>
                    </Checkbox>
                    {formik.touched.agree && formik.errors.agree && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.agree}</p>
                    )}
                    <Button
                        type="primary"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        htmlType="submit"
                        loading={loading}
                    >
                        Đăng ký ngay
                    </Button>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Đã có tài khoản?{" "}
                        <Link to={"/login"} className="text-blue-500">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Register;
