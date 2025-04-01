import { Button, Card, Checkbox, Input } from "antd";
import React from "react";
import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../redux/slices/authSlice";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agree, setAgree] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, message } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        if (!agree) {
            alert("Vui lòng đồng ý với điều khoản sử dụng!");
            return;
        }
        await dispatch(register({ name, email, password })); // Gọi action đăng ký
        if (message) {
            navigate("/login"); // Điều hướng về đăng nhập sau khi đăng ký thành công
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Tạo tài khoản để quản lý tài liệu của bạn
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {message && (
                    <p className="text-green-500 text-center">{message}</p>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        prefix={<FaUser className="text-gray-500" />}
                        placeholder="Họ và tên"
                        className="h-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    <Input
                        prefix={<FaLock className="text-gray-500" />}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        className="h-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        required
                    />
                    <Checkbox
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="text-sm text-gray-600"
                    >
                        Tôi đồng ý với{" "}
                        <a href="#" className="text-blue-500">
                            điều khoản sử dụng
                        </a>
                    </Checkbox>
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
