import React, { useState } from "react";
import { Button, Card, Input } from "antd";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../features/authSlice";

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, message } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(resetPassword({ token, newPassword }));
        if (message) {
            navigate("/login");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Đặt lại mật khẩu
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {message && (
                    <p className="text-green-500 text-center">{message}</p>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        prefix={<FaLock className="text-gray-500" />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu mới"
                        className="h-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        suffix={
                            <span
                                className="cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        }
                        required
                    />
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
