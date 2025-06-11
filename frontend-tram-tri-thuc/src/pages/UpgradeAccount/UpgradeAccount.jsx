import React, { useEffect, useState } from "react";
import { Check, Star, Zap, Crown, Shield, Sparkles, Calendar, Gift, RotateCcw } from "lucide-react";
import customAxios from "../../utils/customAxios";

const UpgradeAccount = () => {
    const [selectedPlan, setSelectedPlan] = useState("6month");
    const [numberDates, setnumberDates] = useState(6);

    // Giả lập dữ liệu user - bạn sẽ thay thế bằng dữ liệu thực từ API/props
    const [userVipStatus, setUserVipStatus] = useState({
        isVip: "not_activated",
        vipStartDate: null,
        vipEndDate: null,
    });

    const fetchUser = async () => {
        try {
            const res = await customAxios.get("/users/me");
            console.log("check thông tin user", res);

            const data = res.data?.data;
            if (data) {
                setUserVipStatus({
                    isVip: data.isVip,
                    vipStartDate: new Date(data.vipStartDate),
                    vipEndDate: new Date(data.vipEndDate),
                });
            }
        } catch (err) {
            console.error("Lỗi khi fetch user:", err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const plans = [
        {
            id: "1month",
            name: "1 Tháng",
            icon: <Shield className="w-8 h-8" />,
            price: 99000,
            originalPrice: 199000,
            period: "/tháng",
            popular: false,
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
        {
            id: "6month",
            name: "6 Tháng",
            icon: <Zap className="w-8 h-8" />,
            price: 149000,
            originalPrice: 199000,
            period: "/tháng",
            popular: true,
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
        {
            id: "12month",
            name: "12 Tháng",
            icon: <Crown className="w-8 h-8" />,
            price: 199000,
            originalPrice: 299000,
            period: "/tháng",
            popular: false,
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
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const getSavingsPercentage = (plan) => {
        return Math.round((1 - plan.price / plan.originalPrice) * 100);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDaysRemaining = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);
    const paymentUrl = `/payment?numberDate=${numberDates}&price=${selectedPlanData?.price}`;

    // Render VIP Status Banner
    const renderVipStatus = () => {
        if (userVipStatus.isVip === "active") {
            const daysRemaining = getDaysRemaining(userVipStatus.vipEndDate);
            return (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                                <Crown className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    🎉 Bạn đang là thành viên VIP!
                                </h3>
                                <p className="text-green-300">
                                    Thời gian còn lại:{" "}
                                    <span className="font-semibold">{daysRemaining} ngày</span>
                                </p>
                                <p className="text-green-400 text-sm">
                                    Hết hạn vào: {formatDate(userVipStatus.vipEndDate)}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium">
                                Đang hoạt động
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (userVipStatus.isVip === "expired") {
            return (
                <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full">
                                <RotateCcw className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    ⚠️ Gói VIP đã hết hạn
                                </h3>
                                <p className="text-red-300">
                                    Hết hạn vào: {formatDate(userVipStatus.vipEndDate)}
                                </p>
                                <p className="text-red-400 text-sm">
                                    Gia hạn ngay để tiếp tục sử dụng các tính năng cao cấp
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium">
                                Đã hết hạn
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Render different headers based on VIP status
    const renderHeader = () => {
        if (userVipStatus.isVip === "active") {
            return (
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Gia Hạn VIP
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Tiếp tục trải nghiệm các tính năng cao cấp với ưu đãi đặc biệt dành cho
                        thành viên VIP
                    </p>
                </div>
            );
        } else if (userVipStatus.isVip === "expired") {
            return (
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full">
                            <RotateCcw className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                        Gia Hạn VIP Ngay
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Đừng để gián đoạn trải nghiệm! Gia hạn ngay để tiếp tục sử dụng các tính
                        năng cao cấp
                    </p>
                </div>
            );
        } else {
            return (
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Nâng Cấp Tài Khoản
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Mở khóa toàn bộ tiềm năng với các gói nâng cấp được thiết kế đặc biệt cho
                        bạn
                    </p>
                </div>
            );
        }
    };

    // Render CTA button text based on VIP status
    const renderCTAText = () => {
        if (userVipStatus.isVip === "active") {
            return "Gia hạn VIP";
        } else if (userVipStatus.isVip === "expired") {
            return "Kích hoạt lại VIP";
        } else {
            return "Nâng cấp ngay";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* VIP Status Banner */}
                {renderVipStatus()}

                {/* Header */}
                {renderHeader()}

                {/* Special Offers for VIP users */}
                {userVipStatus.isVip === "active" && (
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 mb-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                🎁 Ưu đãi đặc biệt cho thành viên VIP
                            </h3>
                            <p className="text-green-300 mb-4">
                                Giảm thêm 20% cho tất cả các gói gia hạn!
                            </p>
                            <div className="flex justify-center space-x-4">
                                <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
                                    ✨ Miễn phí setup
                                </div>
                                <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
                                    🎯 Tư vấn 1-1
                                </div>
                                <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
                                    🔥 Tính năng Beta
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => {
                        // Calculate VIP discount
                        const vipDiscount = userVipStatus.isVip === "active" ? 0.2 : 0;
                        const discountedPrice = plan.price * (1 - vipDiscount);

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                                    plan.popular
                                        ? "border-purple-500 shadow-purple-500/20 shadow-xl"
                                        : "border-gray-700 hover:border-gray-600"
                                } ${selectedPlan === plan.id ? "ring-2 ring-purple-500" : ""}`}
                                onClick={() => {
                                    setSelectedPlan(plan.id), setnumberDates(plan.numberDate);
                                }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                                            <Star className="w-4 h-4" />
                                            <span>Phổ biến nhất</span>
                                        </div>
                                    </div>
                                )}

                                {/* VIP Discount Badge */}
                                {userVipStatus.isVip === "active" && (
                                    <div className="absolute -top-2 -right-2">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                            VIP -20%
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Plan Header */}
                                    <div className="text-center mb-8">
                                        <div
                                            className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} mb-4`}
                                        >
                                            {plan.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-center justify-center space-x-2">
                                            {userVipStatus.isVip === "active" ? (
                                                <>
                                                    <span className="text-4xl font-bold text-white">
                                                        {formatPrice(discountedPrice)}₫
                                                    </span>
                                                    <div className="text-right">
                                                        <div className="text-gray-400 line-through text-sm">
                                                            {formatPrice(plan.price)}₫
                                                        </div>
                                                        <div className="text-gray-300 text-sm">
                                                            {plan.period}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-4xl font-bold text-white">
                                                        {formatPrice(plan.price)}₫
                                                    </span>
                                                    <div className="text-right">
                                                        <div className="text-gray-400 line-through text-sm">
                                                            {formatPrice(plan.originalPrice)}₫
                                                        </div>
                                                        <div className="text-gray-300 text-sm">
                                                            {plan.period}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Tiết kiệm{" "}
                                                {userVipStatus.isVip === "active"
                                                    ? Math.round(
                                                          (1 -
                                                              discountedPrice /
                                                                  plan.originalPrice) *
                                                              100
                                                      )
                                                    : getSavingsPercentage(plan)}
                                                %
                                            </span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-4 mb-8">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mt-0.5">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-gray-300 text-sm leading-relaxed">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                                            selectedPlan === plan.id
                                                ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                    >
                                        {selectedPlan === plan.id ? "Đã chọn" : "Chọn gói này"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <button
                        onClick={() => (window.location.href = paymentUrl)}
                        className={`font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                            userVipStatus.isVip === "active"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                : userVipStatus.isVip === "expired"
                                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        } text-white`}
                    >
                        {renderCTAText()}
                    </button>
                    <p className="text-gray-400 mt-4 text-sm">
                        {userVipStatus.isVip === "active"
                            ? "Gia hạn dễ dàng • Ưu đãi VIP độc quyền • Hỗ trợ 24/7"
                            : "Đảm bảo hoàn tiền 30 ngày • Hủy bất cứ lúc nào • Không có phí ẩn"}
                    </p>
                </div>

                {/* Features Comparison */}
                <div className="mt-20 bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
                    <h3 className="text-2xl font-bold text-white text-center mb-8">
                        {userVipStatus.isVip === "active"
                            ? "Lợi ích khi gia hạn VIP"
                            : "Tại sao nên nâng cấp?"}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">
                                Tốc độ nhanh hơn
                            </h4>
                            <p className="text-gray-400">
                                Trải nghiệm mượt mà với tốc độ xử lý gấp 10 lần
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">
                                Bảo mật cao cấp
                            </h4>
                            <p className="text-gray-400">
                                Mã hóa end-to-end và bảo vệ dữ liệu tuyệt đối
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">
                                Hỗ trợ ưu tiên
                            </h4>
                            <p className="text-gray-400">
                                Đội ngũ chuyên gia hỗ trợ 24/7 chỉ dành cho bạn
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeAccount;
