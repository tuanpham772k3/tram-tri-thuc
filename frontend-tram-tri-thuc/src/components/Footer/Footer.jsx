import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 text-center p-4 mt-8 border-t">
            <div className="container mx-auto">
                <p className="text-sm">
                    © 2025 Trạm Tri Thức. All rights reserved.
                </p>
                <div className="mt-2 space-x-4">
                    <a href="/about" className="hover:underline">
                        Giới thiệu
                    </a>
                    <span>|</span>
                    <a href="/terms" className="hover:underline">
                        Điều khoản
                    </a>
                    <span>|</span>
                    <a href="/privacy" className="hover:underline">
                        Chính sách bảo mật
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
