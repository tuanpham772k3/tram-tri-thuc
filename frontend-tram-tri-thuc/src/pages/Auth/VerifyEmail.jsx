import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";
import { resendVerificationEmailThunk, verifyEmailThunk } from "../../store/slices/authSlice";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

// Atomic Components
const InputField = ({ label, value, onChange, placeholder, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-1 block w-full p-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"}`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

const Button = ({ children, onClick, disabled, primary, loading }) => (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`px-4 py-2 rounded-md ${primary ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
        {loading ? (
            <div className="flex items-center">
                <LoadingSpinner size="small" />
                <span className="ml-2">Đang xử lý...</span>
            </div>
        ) : (
            children
        )}
    </button>
);

const VerifyEmail = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, success, error } = useSelector((state) => state.auth);

    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [resendDisabled, setResendDisabled] = useState(false);

    // Debounce resend button to avoid spam
    const debouncedResend = debounce(() => {
        dispatch(resendVerificationEmailThunk(userId));
        setResendDisabled(true);
        setTimeout(() => setResendDisabled(false), 60000); // Disable for 60s
    }, 300);

    useEffect(() => {
        if (success) {
            navigate("/auth/login"); // Chuyển hướng sau khi verify thành công
        }
    }, [success, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            setErrorMessage("Mã xác thực phải có 6 ký tự.");
            return;
        }
        setErrorMessage("");
        await dispatch(verifyEmailThunk({ userId, verificationCode: code }));
    };

    const handleResend = (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!userId) {
            setErrorMessage("Không tìm thấy email.");
            return;
        }
        debouncedResend();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Kích hoạt tài khoản</h2>
                <p className="text-gray-600 mb-4 text-center">
                    Chúng tôi đã gửi 1 mã code xác nhận về email của bạn, vui lòng nhập để xác nhận
                    tài khoản:
                </p>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="* Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Nhập mã 6 số"
                        error={
                            errorMessage ||
                            (error && error !== "Xác thực email thất bại." ? error : "")
                        }
                    />
                    <div className="flex justify-between mb-4">
                        <Button primary onClick={handleSubmit} disabled={loading} loading={loading}>
                            Submit
                        </Button>
                        <Button
                            onClick={handleResend}
                            disabled={resendDisabled || loading}
                            loading={loading}
                        >
                            Resend
                        </Button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    <a href="/login" className="text-blue-500 hover:underline">
                        Quay lại trang Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
