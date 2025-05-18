import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Button, Card, Input } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../../utils/toast";
import FormInput from "../../components/Auth/FormInput";
import { forgotPassword } from "../../store/slices/authSlice";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            showToast("error", "Vui lòng nhập email");
            return;
        }
        await dispatch(forgotPassword(email));
        if (message) {
            setEmail(""); // Xóa form sau khi gửi thành công
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Quên mật khẩu</h2>
                <p className="text-center text-gray-600 mb-4">
                    Nhập email của bạn để đặt lại mật khẩu.
                </p>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {message && <p className="text-green-500 text-center">{message}</p>}
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        htmlType="submit"
                        loading={loading}
                    >
                        Gửi yêu cầu
                    </Button>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Nhớ mật khẩu?{" "}
                        <Link to={"/auth/login"} className="text-blue-500">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
