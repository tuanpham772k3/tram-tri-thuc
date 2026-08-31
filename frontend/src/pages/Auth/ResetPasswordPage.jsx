import { Button, Card } from "antd";
import { FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import FormInput from "../../components/Auth/FormInput";
import { resetPassword } from "../../store/slices/authSlice";
import { useFormik } from "formik";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ in hoa")
        .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
        .required("Mật khẩu mới là bắt buộc"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
        .required("Xác nhận mật khẩu là bắt buộc"),
    }),
    onSubmit: async (values) => {
      await dispatch(resetPassword({ token, newPassword: values.newPassword }));
      if (message) {
        navigate("/auth/login");
      }
    },
  });

  // Helper function để check password strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

    if (strength < 50) return { strength, label: "Yếu", color: "bg-red-500" };
    if (strength < 75) return { strength, label: "Trung bình", color: "bg-yellow-500" };
    return { strength, label: "Mạnh", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formik.values.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="relative w-full max-w-md bg-white/80 backdrop-blur-lg border-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 -m-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaShieldAlt className="text-2xl text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Đặt lại mật khẩu
          </h2>
          <p className="text-blue-100 text-center text-sm">
            Tạo mật khẩu mới an toàn cho tài khoản của bạn
          </p>
        </div>

        {/* Error/Success messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            <p className="text-green-600 text-sm font-medium">{message}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {/* New Password Field */}
          <div>
            <FormInput
              formik={formik}
              name="newPassword"
              type="password"
              placeholder="Mật khẩu mới"
              icon={FaLock}
              isPassword
            />

            {/* Password Strength Indicator */}
            {formik.values.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Độ mạnh mật khẩu</span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.strength < 50
                        ? "text-red-600"
                        : passwordStrength.strength < 75
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <FormInput
            formik={formik}
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            icon={FaLock}
            isPassword
          />

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Yêu cầu mật khẩu:</h4>
            <div className="space-y-1">
              <div
                className={`flex items-center gap-2 text-xs ${
                  formik.values.newPassword.length >= 6
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    formik.values.newPassword.length >= 6 ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                Ít nhất 6 ký tự
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${
                  /[A-Z]/.test(formik.values.newPassword)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    /[A-Z]/.test(formik.values.newPassword)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                Chứa chữ in hoa
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${
                  /[0-9]/.test(formik.values.newPassword)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    /[0-9]/.test(formik.values.newPassword)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                Chứa số
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            htmlType="submit"
            loading={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Bạn đã đổi mật khẩu thành công?{" "}
              <Link
                to={"/auth/login"}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
