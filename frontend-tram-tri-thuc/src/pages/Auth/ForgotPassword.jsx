import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Button, Card } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../../utils/toast";
import FormInput from "../../components/Auth/FormInput";
import { forgotPasswordThunk } from "../../store/slices/authSlice";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            showToast("error", "Vui lòng nhập email");
            return;
        }
        await dispatch(forgotPasswordThunk(email));
    };

    return (
         <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
            {/* Minh hoạ bên trái */}
          

            {/* Form bên phải */}
            <div className="flex items-center justify-center px-4 py-8">
                <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Quên mật khẩu
                    </h2>
                    <p className="text-center text-gray-600 mb-4">
                        Nhập email để nhận liên kết đặt lại mật khẩu.
                    </p>

                    {error && (
                        <p className="text-red-500 text-center text-sm mb-2">{error}</p>
                    )}
                    {message && (
                        <p className="text-green-500 text-center text-sm mb-2">{message}</p>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <FormInput
                            name="email"
                            placeholder="Email"
                            icon={FaEnvelope}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        >
                            Gửi yêu cầu
                        </Button>

                        <p className="text-center text-sm text-gray-600 mt-2">
                            Nhớ mật khẩu?{" "}
                            <Link to="/auth/login" className="text-blue-500 hover:underline">
                                Đăng nhập
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
