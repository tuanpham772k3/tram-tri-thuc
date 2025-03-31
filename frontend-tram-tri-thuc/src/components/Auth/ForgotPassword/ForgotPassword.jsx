import React from "react";
import { FaEnvelope } from "react-icons/fa";
import { Button, Card, Input } from "antd";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Quên mật khẩu
                </h2>
                <p className="text-center text-gray-600 mb-4">
                    Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
                </p>
                <form className="space-y-4">
                    <Input
                        prefix={<FaEnvelope className="text-gray-500" />}
                        placeholder="Email"
                        type="email"
                        className="h-10"
                    />
                    <Button
                        type="primary"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                    >
                        Gửi yêu cầu
                    </Button>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Nhớ mật khẩu?{" "}
                        <Link to={"/login"} className="text-blue-500">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
