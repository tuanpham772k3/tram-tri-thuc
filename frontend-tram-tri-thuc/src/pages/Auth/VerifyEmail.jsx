import React, { useEffect, useState } from "react";
import { Button, Card, Result, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import showToast from "../../utils/toast";
import { FaCheckCircle, FaEnvelope, FaExclamationTriangle } from "react-icons/fa";
import FormInput from "../../components/Auth/FormInput";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { resendVerificationEmail, verifyEmail } from "../../store/slices/authSlice";

const VerifyEmail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, message, isEmailVerified } = useSelector((state) => state.auth);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [email, setEmail] = useState("");
    const [isVerifying, setIsVerifying] = useState(!!token);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendEmail, setResendEmail] = useState("");

    useEffect(() => {
        if (token && isVerifying) {
            dispatch(verifyEmail(token)).then(() => {
                setIsVerifying(false);
            });
        }
    }, [token, dispatch, isVerifying]);

    const handleResend = async (e) => {
        e.preventDefault();
        if (!email) {
            showToast("error", "Vui lòng nhập email");
            return;
        }

        const result = await dispatch(resendVerificationEmail(email));
        if (!result.error) {
            setResendSuccess(true);
            setResendEmail(email);
            setEmail("");
        }
    };

    const handleLoginRedirect = () => {
        navigate("/auth/login");
    };

    const renderVerifyingState = () => (
        <div className="text-center py-8">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600">Đang xác minh email của bạn...</p>
        </div>
    );

    const renderVerifiedState = () => (
        <Result
            icon={<FaCheckCircle className="block text-6xl text-green-500 mx-auto" />}
            status="success"
            title="Xác minh email thành công!"
            subTitle="Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ."
            extra={[
                <Button
                    key="login"
                    type="primary"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                    onClick={handleLoginRedirect}
                >
                    Đăng nhập ngay
                </Button>,
            ]}
        />
    );

    const renderErrorState = () => (
        <Result
            icon={<FaExclamationTriangle className="block text-5xl text-yellow-500 mx-auto" />}
            status="warning"
            title="Xác minh không thành công"
            subTitle={error || "Đã xảy ra lỗi khi xác minh email. Vui lòng thử lại."}
            extra={[
                <div key="form" className="w-full max-w-sm mx-auto">
                    <p className="text-center text-gray-600 mb-4">
                        Vui lòng nhập email để gửi lại liên kết xác minh:
                    </p>
                    <form className="space-y-4" onSubmit={handleResend}>
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
                            Gửi lại email xác minh
                        </Button>
                    </form>
                </div>,
            ]}
        />
    );

    const renderResendForm = () => (
        <>
            {resendSuccess ? (
                <Result
                    icon={<FaEnvelope className="block text-5xl text-blue-500 mx-auto" />}
                    status="info"
                    title="Email đã được gửi!"
                    subTitle={`Chúng tôi đã gửi liên kết xác minh đến ${resendEmail}. Vui lòng kiểm tra hộp thư của bạn và bấm vào liên kết để xác minh tài khoản.`}
                    extra={[
                        <Button
                            key="resend"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg"
                            onClick={() => setResendSuccess(false)}
                        >
                            Gửi lại lần nữa
                        </Button>,
                    ]}
                />
            ) : (
                <>
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-4 rounded-full">
                            <FaEnvelope className="text-3xl text-blue-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Xác thực email
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Vui lòng kiểm tra email của bạn để xác minh tài khoản. Nếu không nhận được
                        email, nhập email để gửi lại.
                    </p>
                    <form className="space-y-4" onSubmit={handleResend}>
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
                            Gửi lại email xác minh
                        </Button>
                    </form>
                </>
            )}
        </>
    );

    const renderContent = () => {
        if (isVerifying) {
            return renderVerifyingState();
        } else if (isEmailVerified) {
            return renderVerifiedState();
        } else if (token && error) {
            return renderErrorState();
        } else {
            return renderResendForm();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-xl">{renderContent()}</Card>
        </div>
    );
};

export default VerifyEmail;
