import { Button, Card, Checkbox, Input } from "antd";
import React from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/Auth/FormInput";
import { register } from "../../store/slices/authSlice";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, needsVerification, message } = useSelector((state) => state.auth);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            showPassword: false,
            showConfirmPassword: false,
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
                .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ in hoa")
                .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
            agree: Yup.boolean().oneOf([true], "You must agree to the terms of use").required(),
        }),
        onSubmit: async (values) => {
            const { name, email, password } = values;
            await dispatch(register({ name, email, password }));
        },
    });

    React.useEffect(() => {
        if (!error && message && needsVerification) {
            navigate("/auth/verify");
        }
    }, [error, message, needsVerification, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Tạo tài khoản để quản lý tài liệu của bạn
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <FormInput formik={formik} name="name" placeholder="Họ và tên" icon={FaUser} />
                    <FormInput formik={formik} name="email" placeholder="Email" icon={FaEnvelope} />
                    <FormInput
                        formik={formik}
                        name="password"
                        type="password"
                        placeholder="Mật khẩu"
                        icon={FaLock}
                        isPassword
                    />
                    <FormInput
                        formik={formik}
                        name="confirmPassword"
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        icon={FaLock}
                        isPassword
                    />
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
                        <Link to={"/auth/login"} className="text-blue-500">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Register;
