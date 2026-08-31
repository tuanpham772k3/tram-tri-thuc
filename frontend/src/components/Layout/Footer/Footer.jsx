import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-slate-100 to-gray-200 text-gray-800 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-400 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-cyan-400 rounded-full blur-2xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Main content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
                    {/* Brand section */}
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center mr-3 shadow-md">
                                <span className="text-xl font-bold text-white">TT</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Trạm Tri Thức</h3>
                        </div>
                        <p className="text-sm">
                            Chúng tôi chuyên về tài liệu sách và tài liệu lập trình, chia sẻ kiến
                            thức và học hỏi.
                        </p>
                        {/* Social media */}
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-6">Dịch Vụ</h4>
                        <div className="space-y-3">
                            {["Tài liệu kinh tế", "Tài liệu lập trình", "Tài liệu khoa học"].map(
                                (service, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="group flex items-center text-gray-600 hover:text-blue-700 transition-all duration-300 text-sm"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                                            {service}
                                        </span>
                                    </a>
                                )
                            )}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-6">Liên Hệ</h4>
                        <div className="flex flex-col space-y-4">
                            {[
                                {
                                    Icon: Facebook,
                                    color: "from-blue-600 to-blue-800",
                                    name: "Facebook",
                                },
                                {
                                    Icon: Instagram,
                                    color: "from-pink-500 to-rose-700",
                                    name: "Instagram",
                                },
                                {
                                    Icon: Twitter,
                                    color: "from-sky-500 to-blue-700",
                                    name: "Twitter",
                                },
                                {
                                    Icon: Linkedin,
                                    color: "from-blue-700 to-indigo-900",
                                    name: "LinkedIn",
                                },
                            ].map(({ Icon, color, name }, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="group flex items-center text-gray-600 hover:text-gray-800 transition-all duration-300"
                                >
                                    <div
                                        className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}
                                    >
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">{name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Google Map */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-6">Bản Đồ</h4>
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.630273870374!2d106.69833261474925!3d10.771017892324396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38d03e0e95%3A0x6d837e3f8b828d!2s123%20L%C3%AA%20L%E1%BB%A3i%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20Qu%E1%BA%ADn%201%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam!5e0!3m2!1sen!2s!4v1698765432100!5m2!1sen!2s"
                                className="w-full h-48 rounded-lg"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-gray-300 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Trạm Tri Thức. Tất cả các quyền được bảo lưu.
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                        <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">
                            Chính sách bảo mật
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">
                            Điều khoản sử dụng
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
