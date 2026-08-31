import { Button, Checkbox } from "antd";
import { FaEnvelope, FaLock, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/Auth/FormInput";
import backgroundImage from "../../assets/image2.jpg";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
      password: Yup.string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
    }),
    onSubmit: async ({ email, password, remember }) => {
      dispatch(LoginPage({ email, password, remember }));
    },
  });

  return (
    <div
      className="min-h-screen flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/*   */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Brand */}
          <div className="space-y-4 hidden lg:block">
            {/* Brand Section */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                <FaStar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                KhoTangTriThuc
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg font-['Playfair_Display']">
              <span className="font-['Montserrat'] tracking-wide">Nền tảng chia sẻ</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-violet-400 bg-clip-text text-transparent font-['Playfair_Display'] italic">
                tri thức hàng đầu
              </span>
            </h1>

            <p className="text-xl font-['Montserrat'] text-purple-100 mb-8 max-w-2xl drop-shadow leading-relaxed tracking-wide">
              <span className="font-light">Khám phá</span> hàng triệu{" "}
              <span className="text-cyan-300 font-medium">tài liệu học thuật</span>,{" "}
              <span className="text-pink-300 font-medium">sách điện tử</span> và{" "}
              <span className="text-violet-300 font-medium">nghiên cứu</span>{" "}
              <span className="font-light">từ khắp nơi trên thế giới</span>
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-4xl shadow-2xl border border-white/30 p-8 lg:p-12 max-w-md mx-auto w-full hover:border-white/40 transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500/80 to-violet-600/80 backdrop-blur-sm rounded-[1.5rem] mb-6 shadow-xl shadow-pink-500/20 rotate-6 hover:rotate-0 transition-transform duration-300 border border-white/20">
                <FaLock className="w-8 h-8 text-white/90" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-['Playfair_Display'] drop-shadow-md">
                Đăng nhập
              </h2>
              <p className="text-white/80 font-['Montserrat']">
                Chào mừng bạn quay trở lại!
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <div className="space-y-5">
                <FormInput
                  formik={formik}
                  name="email"
                  placeholder="Nhập email của bạn"
                  icon={FaEnvelope}
                  className="transition-all duration-200"
                  inputClassName="w-full px-5 py-4 pl-14 rounded-2xl bg-white/5 backdrop-blur-sm text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200 font-['Montserrat']"
                />
                <FormInput
                  formik={formik}
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  icon={FaLock}
                  isPassword
                  className="transition-all duration-200"
                  inputClassName="w-full px-5 py-4 pl-14 rounded-2xl bg-white/5 backdrop-blur-sm text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200 font-['Montserrat']"
                />
              </div>

              <div className="flex items-center justify-between text-sm font-['Montserrat']">
                <Checkbox
                  name="remember"
                  checked={formik.values.remember}
                  onChange={formik.handleChange}
                  className="text-white/80 hover:scale-105 transition-transform duration-200"
                >
                  <span className="text-white/80">Ghi nhớ đăng nhập</span>
                </Checkbox>
                <Link
                  to="/forgot-password"
                  className="text-pink-300 hover:text-pink-200 font-medium transition-colors duration-200 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-14 bg-gradient-to-r from-pink-500/80 to-violet-600/80 hover:from-pink-500/90 hover:to-violet-600/90 backdrop-blur-sm border-0 rounded-2xl font-semibold text-base shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-200 font-['Montserrat'] hover:scale-[1.02]"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              {/* Divider */}

              {/* Register Link */}
              <p className="text-center text-white/70 text-sm mt-8 font-['Montserrat']">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-pink-300 hover:text-pink-200 font-semibold transition-colors duration-200 hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
