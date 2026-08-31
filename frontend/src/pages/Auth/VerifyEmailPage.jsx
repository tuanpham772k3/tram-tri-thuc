import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";
import { resendVerificationEmail, verifyEmail } from "../../store/slices/authSlice";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

// Atomic Components
const InputField = ({ label, value, onChange, placeholder, error }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
        error
          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
          : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-200 focus:bg-white"
      }`}
      maxLength={6}
    />
    {error && (
      <div className="mt-2 flex items-center text-red-600">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm">{error}</span>
      </div>
    )}
  </div>
);

const Button = ({ children, onClick, disabled, primary, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
      primary
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-md"
    } ${
      disabled || loading
        ? "opacity-50 cursor-not-allowed transform-none hover:scale-100"
        : ""
    }`}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <LoadingSpinner size="small" />
        <span className="ml-2">Đang xử lý...</span>
      </div>
    ) : (
      children
    )}
  </button>
);

const VerifyEmailPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.auth);

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);

  // Debounce resend button to avoid spam
  const debouncedResend = debounce(() => {
    dispatch(resendVerificationEmail(userId));
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
    await dispatch(verifyEmail({ userId, verificationCode: code }));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Kích hoạt tài khoản
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              <span className="font-semibold">📧 Kiểm tra email của bạn!</span>
              <br />
              Chúng tôi đã gửi mã xác thực 6 số về email. Vui lòng nhập mã để kích hoạt
              tài khoản.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="* Mã xác thực"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã 6 số"
            error={
              errorMessage || (error && error !== "Xác thực email thất bại." ? error : "")
            }
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              primary
              onClick={handleSubmit}
              disabled={loading || code.length !== 6}
              loading={loading}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Xác thực
              </span>
            </Button>
            <Button
              onClick={handleResend}
              disabled={resendDisabled || loading}
              loading={loading}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Gửi lại
              </span>
            </Button>
          </div>

          {resendDisabled && (
            <div className="text-center">
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ⏱️ Vui lòng đợi 60 giây trước khi gửi lại mã
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
            >
              Đăng nhập ngay →
            </a>
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Bước 2/3: Xác thực email
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmailPage;
