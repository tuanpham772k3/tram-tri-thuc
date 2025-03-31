import { Button, Card, Checkbox, Input } from "antd";
import React from "react";
import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Tạo tài khoản để quản lý tài liệu của bạn
                </h2>
                <form className="space-y-4">
                    <Input
                        prefix={<FaUser className="text-gray-500" />}
                        placeholder="Họ và tên"
                        className="h-10"
                    />
                    <Input
                        prefix={<FaEnvelope className="text-gray-500" />}
                        placeholder="Email"
                        type="email"
                        className="h-10"
                    />
                    <Input
                        prefix={<FaLock className="text-gray-500" />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        className="h-10"
                        suffix={
                            <span
                                className="cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        }
                    />
                    <Input
                        prefix={<FaLock className="text-gray-500" />}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        className="h-10"
                        suffix={
                            <span
                                className="cursor-pointer text-gray-500"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </span>
                        }
                    />
                    <Checkbox className="text-sm text-gray-600">
                        Tôi đồng ý với{" "}
                        <a href="#" className="text-blue-500">
                            điều khoản sử dụng
                        </a>
                    </Checkbox>
                    <Button
                        type="primary"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
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
