import React, { useState } from "react";
import { Button, Card, Input, Checkbox } from "antd";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/slices/authSlice";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(login({ email, password }));
        if (token) {
            navigate("/home"); // Điều hướng sau khi đăng nhập thành công
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Đăng nhập vào tài khoản của bạn
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        prefix={<FaEnvelope className="text-gray-500" />}
                        placeholder="Email"
                        type="email"
                        className="h-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        prefix={<FaLock className="text-gray-500" />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        className="h-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <Checkbox
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
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
