import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";

const cartItems = [
  {
    id: 1,
    name: "Tâm lý học về tiền",
    author: "Toni Kroos",
    price: 109, // để tính ra tổng tương đương $437 với sl 4
    quantity: 4,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Tư duy nhanh và chậm",
    author: "Toni Kroos",
    price: 472, // để tính ra tổng $945 với sl 2
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1c0c5624d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 3,
    name: "Thói quen nguyên tử",
    author: "Toni Kroos",
    price: 85, // để tính ra tổng $597 với sl 7
    quantity: 7,
    image:
      "https://images.unsplash.com/photo-1580481077494-e3299acae5c7?auto=format&fit=crop&q=80&w=200",
  },
];

const CheckoutPage = () => {
  const [items, setItems] = useState(cartItems);
  const [paymentMethod, setPaymentMethod] = useState("");

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-8">
      {/* Phần 1: bảng sản phẩm bên trái (chiếm 2 cột) */}
      <section className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        {/* Tiêu đề Trang */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
          <Link
            to={"/cart"}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer hover:underline"
          >
            <ArrowLeft size={18} />
            <span className="text-base">Quay lại giỏ hàng</span>
          </Link>
        </div>
        <hr className="border-gray-300 mb-6" />
        {/* Tiêu đề bảng */}
        <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-500 pb-4 border-b border-gray-100 mb-6">
          <div className="col-span-3">Sản phẩm</div>
          <div className="col-span-1 text-center">Đơn giá</div>
          <div className="col-span-1 text-center">Số lượng</div>
          <div className="col-span-1 text-center">Số tiền</div>
        </div>

        {/* Danh sách sản phầm mua */}
        {items.length === 0 ? (
          <p className="py-12 text-center text-gray-400">
            Chưa có đơn hàng nào được chọn
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 mb-8">
            {items.map((item) => {
              const itemTotal = (item.price * item.quantity).toFixed(0);
              return (
                <li key={item.id} className="py-6 grid grid-cols-6 items-center gap-2">
                  {/* Thông tin sản phẩm & Hình ảnh */}
                  <div className="col-span-3 md:flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-0.5 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm md:text-base mb-0.5">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-0.5">{item.author}</p>
                    </div>
                  </div>

                  {/* Gía */}
                  <div className="col-span-1 flex justify-center">
                    <span className="text-sm text-center font-medium text-gray-800">
                      ${item.price}
                    </span>
                  </div>

                  {/* Số lượng (Quantity Stepper) */}
                  <div className="col-span-1 flex justify-center">
                    <span className="w-6 text-center text-sm font-medium text-gray-800">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Tổng tiền sản phẩm */}
                  <div className="col-span-1 text-center">
                    <span className="font-bold text-gray-900 text-base md:text-lg">
                      ${itemTotal}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Phần 2: Order Summary bên phải (Chiếm 1 cột) */}
      <aside className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
        {/* Thông tin thanh toán */}
        <form onSubmit={() => {}}>
          <h2 className="text-lg font-semibold mb-8">Chọn phương thức thanh toán</h2>

          {/* Phương thức thanh toán */}
          <div className="flex flex-col gap-4">
            {/* Thẻ */}
            <label className="flex items-center gap-4 rounded-md px-4 py-3 cursor-pointer border border-gray-300 hover:bg-gray-200">
              <input type="radio" name="paymentMethod" value="card" defaultChecked />
              <CreditCard className="w-8 h-8" />
              <span className="text-base font-medium">Thanh toán bằng thẻ tín dụng</span>
            </label>
            {/* ZaloPay */}
            <label className="flex items-center gap-4 rounded-md px-4 py-3 cursor-pointer border border-gray-300 hover:bg-gray-200">
              <input type="radio" name="paymentMethod" value="zalopay" />
              <div className="w-8 h-8 shrink-0 rounded-md overflow-hidden">
                <img
                  src="https://cdn.tgdd.vn/2020/04/GameApp/image-180x180.png"
                  alt="ZaloPay"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-base font-medium">ZaloPay</span>
            </label>
            {/* MoMo */}
            <label className="flex items-center gap-4 rounded-md px-4 py-3 cursor-pointer border border-gray-300 hover:bg-gray-200">
              <input type="radio" name="paymentMethod" value="momo" />
              <div className="w-8 h-8 shrink-0 rounded-md overflow-hidden">
                <img
                  src="https://cdn.tgdd.vn/2020/03/GameApp/Untitled-2-200x200.jpg"
                  alt="MoMo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-base font-medium">MoMo</span>
            </label>
          </div>

          {/* Chi tiết thẻ */}
          <div className="mt-6">
            <h3 className="text-base font-semibold mb-4">Chi tiết thẻ</h3>
            <div className="space-y-4">
              {/* Số thẻ */}
              <div className="flex flex-col gap-0.5">
                <label htmlFor="card-number" className="text-sm font-semibold">
                  Số thẻ
                </label>
                <input
                  id="card-number"
                  name="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="py-2 px-3 border-2 border-gray-300 rounded-lg outline-0 focus:border-violet-600"
                />
              </div>
              {/* Ngày hết hạn & CVC */}
              <div className="flex gap-2">
                <div className="w-full min-w-0 flex flex-col gap-0.5">
                  <label htmlFor="expiry-day" className="text-sm font-semibold">
                    Ngày hết hạn
                  </label>
                  <input
                    id="expiry-day"
                    name="expiryDay"
                    type="text"
                    placeholder="MM/YY"
                    className="py-2 px-3 border-2 border-gray-300 rounded-lg outline-0 focus:border-violet-600"
                  />
                </div>
                <div className="w-full min-w-0 flex flex-col gap-0.5">
                  <label htmlFor="cvc" className="text-sm font-semibold">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    name="cvc"
                    type="text"
                    placeholder="123"
                    className="py-2 px-3 border-2 border-gray-300 rounded-lg outline-0 focus:border-violet-600"
                  />
                </div>
              </div>
              {/* Tên thẻ */}
              <div className="flex flex-col gap-0.5">
                <label htmlFor="card-name" className="text-sm font-semibold">
                  Tên thẻ
                </label>
                <input
                  id="card-name"
                  name="cardName"
                  type="text"
                  placeholder="Toni Pham"
                  className="py-2 px-3 border-2 border-gray-300 rounded-lg outline-0 focus:border-violet-600"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-300 mt-8" />

          {/* Tổng thanh toán */}
          <div className="mt-6">
            {/* Ô nhập mã giảm giá & Nút Apply */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Phiếu giảm giá"
                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2.5 text-sm
                focus:outline-none focus:border-violet-600 transition-colors text-gray-800 placeholder-gray-400"
              />
              <button
                type="button"
                className="px-6 py-2.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700
                hover:text-violet-600 hover:bg-violet-200 hover:border-violet-600 transition-colors cursor-pointer"
              >
                Áp dụng
              </button>
            </div>

            {/* Chi tiết giá tiền */}
            <div className="space-y-3.5 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền hàng</span>
                <span className="font-semibold text-gray-900">2.000 USD</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá (10%)</span>
                <span className="font-semibold text-gray-900">-1.000 USD</span>
              </div>
            </div>

            <hr className="border-gray-300 mb-6" />

            {/* Tổng cộng Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold text-gray-900">Tổng thanh toán</span>
              <span className="text-2xl font-black text-gray-900">$1850 USD</span>
            </div>

            {/* Thông tin bảo hành */}
            <div className="flex items-start gap-2.5 bg-gray-50 p-3.5 rounded-2xl mb-8 border border-gray-100">
              <ShieldCheck className="text-gray-500 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-gray-500 leading-relaxed">
                90 Day divmited Warranty against manufacturer's defects{" "}
                <a
                  href="#details"
                  className="text-black font-semibold underdivne hover:text-gray-700"
                >
                  Chi tiết
                </a>
              </p>
            </div>
          </div>

          {/* Nút Thanh toán ngay */}
          <button
            type="submit"
            className="w-full bg-violet-500 text-white py-4 rounded-full font-bold text-base
          hover:bg-violet-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Thanh toán ngay
          </button>
        </form>
      </aside>
    </div>
  );
};

export default CheckoutPage;
