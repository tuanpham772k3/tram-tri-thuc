import React, { useState } from "react";
import {
    CreditCard,
    Shield,
    Lock,
    Check,
    ArrowLeft,
    Star,
    Zap,
    Crown,
    Gift,
    User,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import customAxios from "../../utils/customAxios";

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const selectedPlan = searchParams.get("plan") || "6month"; // Default to 6month
    const numberDates = parseInt(searchParams.get("numberDate")) || 6; // Default to 6
    const priceFromUrl = searchParams.get("price") ? parseInt(searchParams.get("price")) : null;

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
    });

    const planDetails = {
        "1month": {
            name: "1 Tháng",
            icon: <Shield className="w-6 h-6" />,
            price: 99000,
            originalPrice: 199000,
            period: "/tháng",
            color: "from-blue-500 to-blue-600",
            features: [
                "Truy cập không giới hạn các tính năng cơ bản",
                "Hỗ trợ qua email 24/7",
                "Lưu trữ 10GB",
                "Đồng bộ trên 3 thiết bị",
                "Bảo mật cơ bản",
            ],
            numberDate: 1,
        },
        "6month": {
            name: "6 Tháng",
            icon: <Zap className="w-6 h-6" />,
            price: 149000,
            originalPrice: 199000,
            period: "/tháng",
            color: "from-purple-500 to-purple-600",
            features: [
                "Tất cả tính năng của gói 1 tháng",
                "Truy cập AI Premium",
                "Lưu trữ 100GB",
                "Đồng bộ không giới hạn thiết bị",
                "Phân tích chi tiết",
                "Xuất báo cáo PDF",
                "Hỗ trợ ưu tiên",
            ],
            numberDate: 6,
        },
        "12month": {
            name: "12 Tháng",
            icon: <Crown className="w-6 h-6" />,
            price: 199000,
            originalPrice: 299000,
            period: "/tháng",
            color: "from-amber-500 to-amber-600",
            features: [
                "Tất cả tính năng của gói 6 tháng",
                "Lưu trữ không giới hạn",
                "API tùy chỉnh",
                "Tích hợp doanh nghiệp",
                "Quản lý nhóm nâng cao",
                "Bảo mật cấp độ doanh nghiệp",
                "Hỗ trợ dedicated manager",
                "SLA 99.9% uptime",
            ],
            numberDate: 12,
        },
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const getSavings = () => {
        const plan = planDetails[selectedPlan];
        return plan.originalPrice - plan.price;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === "zalopay") {
            try {
                const res = await customAxios.post("/users/paymentZaloPay", {
                    price: priceFromUrl,

                    numberDate: numberDates,
                });

                const paymentLink = res?.data?.response?.order_url;

                if (paymentLink) {
                    window.open(paymentLink);
                } else {
                    console.error("Không có link thanh toán trong response");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API payment:", error);
            }
        }
    };

    const displayPrice = priceFromUrl || planDetails[selectedPlan].price;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/upgradeAccount"
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Quay lại</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Hoàn tất đơn hàng</h1>
                    <p className="text-gray-400">
                        Chỉ còn một bước nữa để nâng cấp tài khoản của bạn
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <div className="space-y-8">
                        {/* Account Information */}
                        {paymentMethod !== "zalopay" && (
                            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                    <User className="w-5 h-5" />
                                    <span>Thông tin tài khoản</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                            placeholder="Nhập họ và tên"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                            placeholder="0123 456 789"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Thành phố
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                            placeholder="Thành phố"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Method */}
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                <CreditCard className="w-5 h-5" />
                                <span>Phương thức thanh toán</span>
                            </h2>

                            {/* Payment Options */}
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                {[
                                    {
                                        id: "card",
                                        name: "Thẻ tín dụng/ghi nợ",
                                        icon: <CreditCard className="w-5 h-5" />,
                                    },
                                    {
                                        id: "zalopay",
                                        name: "ZaloPay",
                                        icon: (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                                        ),
                                    },
                                    {
                                        id: "bank",
                                        name: "Chuyển khoản",
                                        icon: <MapPin className="w-5 h-5" />,
                                    },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-4 rounded-lg border transition-all ${
                                            paymentMethod === method.id
                                                ? "border-purple-500 bg-purple-500/10"
                                                : "border-gray-600 hover:border-gray-500"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2 text-white">
                                            {method.icon}
                                            <span className="text-sm font-medium">
                                                {method.name}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Card Details */}
                            {paymentMethod === "card" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Số thẻ *
                                        </label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Tên trên thẻ *
                                            </label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                value={formData.cardName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                                placeholder="NGUYEN VAN A"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                MM/YY *
                                            </label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                                placeholder="12/25"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                                placeholder="123"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "zalopay" && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold">Z</span>
                                    </div>
                                    <p className="text-gray-300">
                                        Bạn sẽ được chuyển hướng đến ZaloPay để hoàn tất thanh toán
                                    </p>
                                </div>
                            )}

                            {paymentMethod === "bank" && (
                                <div className="bg-gray-700/30 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-2">
                                        Thông tin chuyển khoản:
                                    </h4>
                                    <div className="space-y-1 text-sm text-gray-300">
                                        <p>Ngân hàng: Vietcombank</p>
                                        <p>Số tài khoản: 1234567890</p>
                                        <p>Chủ tài khoản: CONG TY ABC</p>
                                        <p>
                                            Nội dung: {formData.fullName || "[Họ tên]"} - Nâng cấp{" "}
                                            {planDetails[selectedPlan].name}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        {/* Plan Summary */}
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-white mb-6">
                                Tóm tắt đơn hàng
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                                    <div
                                        className={`p-3 rounded-full bg-gradient-to-r ${planDetails[selectedPlan].color}`}
                                    >
                                        {planDetails[selectedPlan].icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">
                                            Gói {planDetails[selectedPlan].name}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Thời hạn {numberDates} tháng
                                        </p>
                                    </div>
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-3 pt-4 border-t border-gray-700">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Giá gốc</span>
                                        <span className="line-through">
                                            {formatPrice(planDetails[selectedPlan].originalPrice)}₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Giá sau giảm</span>
                                        <span>{formatPrice(displayPrice)}₫</span>
                                    </div>
                                    <div className="flex justify-between text-green-400 font-medium">
                                        <span>Tiết kiệm</span>
                                        <span>-{formatPrice(getSavings())}₫</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-gray-700">
                                        <span>Tổng cộng</span>
                                        <span>{formatPrice(displayPrice)}₫</span>
                                    </div>
                                </div>

                                {/* Benefits Reminder */}
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-6">
                                    <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                                        <Gift className="w-4 h-4" />
                                        <span>Những gì bạn nhận được:</span>
                                    </h4>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                        {planDetails[selectedPlan].features.map(
                                            (feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Check className="w-3 h-3 text-green-400" />
                                                    <span>{feature}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                {/* Security Notice */}
                                <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-700/20 rounded-lg p-3">
                                    <Shield className="w-4 h-4 text-green-400" />
                                    <span>Thanh toán được bảo mật với mã hóa SSL 256-bit</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <Lock className="w-5 h-5" />
                            <span>Thanh toán an toàn</span>
                        </button>

                        {/* Guarantee */}
                        <div className="text-center text-sm text-gray-400">
                            <div className="flex items-center justify-center space-x-1 mb-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>Đảm bảo hoàn tiền 100% trong 30 ngày</span>
                            </div>
                            <p>Không hài lòng? Chúng tôi hoàn tiền không điều kiện</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
