import React, { useState } from "react";
import { Button, Card, Input } from "antd";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import FormInput from "../../components/Auth/FormInput";
import { resetPassword } from "../../store/slices/authSlice";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, message } = useSelector((state) => state.auth);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
            showPassword: false,
            showConfirmPassword: false,
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
                .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ in hoa")
                .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
                .required("Mật khẩu mới là bắt buộc"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
                .required("Xác nhận mật khẩu là bắt buộc"),
        }),
        onSubmit: async (values) => {
            await dispatch(resetPassword({ token, newPassword: values.newPassword }));
            if (message) {
                navigate("/auth/login");
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Đặt lại mật khẩu
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {message && <p className="text-green-500 text-center">{message}.</p>}
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <FormInput
                        formik={formik}
                        name="newPassword"
                        type="password"
                        placeholder="Mật khẩu mới"
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
                    <p className="text-sm text-gray-600">
                        Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ in hoa và số.
                    </p>
                    <Button
                        type="primary"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        htmlType="submit"
                        loading={loading}
                    >
                        Cập nhật mật khẩu
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ResetPassword;
