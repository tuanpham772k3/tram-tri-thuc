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
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleCheckout = (e) => {
    e.preventDefault();

    console.log("Phương thức thanh toán:", paymentMethod);

    // Tiếp tục xử lý đơn hàng
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-8">
      {/* Phần 1: Danh sách sản phẩm bên trái (chiếm 2 cột) */}
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

      {/* Phần 2: Thanh toán bên phải (Chiếm 1 cột) */}
      <aside className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
        <form onSubmit={handleCheckout}>
          <h2 className="mb-6 text-lg font-semibold">Chọn phương thức thanh toán</h2>

          {/* Phương thức thanh toán */}
          <div className="flex flex-col gap-3">
            {/* Thẻ */}
            <label
              className={`flex items-center gap-4 rounded-md px-4 py-3 cursor-pointer border transition-colors ${
                paymentMethod === "card"
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                onChange={() => {
                  setPaymentMethod("card");
                }}
                checked={paymentMethod === "card"}
              />
              <CreditCard className="w-8 h-8" />
              <span className="text-base font-medium">Thanh toán bằng thẻ tín dụng</span>
            </label>
            {/* ZaloPay */}
            <label
              className={`flex items-center gap-4 rounded-md px-4 py-3 cursor-pointer border transition-colors ${
                paymentMethod === "zalopay"
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="zalopay"
                onChange={() => {
                  setPaymentMethod("zalopay");
                }}
                checked={paymentMethod === "zalopay"}
              />
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
            <label
              className={`flex items-center gap-4 rounded-md px-4 py-3 cursor-pointer border transition-colors ${
                paymentMethod === "momo"
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                onChange={() => {
                  setPaymentMethod("momo");
                }}
                checked={paymentMethod === "momo"}
              />
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

          {/* Chi tiết phương thức thanh toán */}
          {paymentMethod === "card" && (
            <div className="mt-6 space-y-4 rounded-xl bg-gray-50 p-4">
              <h3 className="text-base font-semibold">Chi tiết thẻ</h3>
              {/* Số thẻ */}
              <div>
                <label htmlFor="card-number" className="mb-1 block text-sm font-semibold">
                  Số thẻ
                </label>
                <input
                  id="card-number"
                  name="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  autoComplete="cc-number"
                  className="w-full min-w-0 rounded-lg py-2 px-3 border-2 border-gray-300 outline-none focus:border-violet-600"
                />
              </div>
              {/* Ngày hết hạn & CVC */}
              <div className="flex gap-3">
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="expiry-day"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Ngày hết hạn
                  </label>
                  <input
                    id="expiry-day"
                    name="expiryDay"
                    type="text"
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    className="w-full min-w-0 rounded-lg py-2 px-3 border-2 border-gray-300 outline-none focus:border-violet-600"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="cvc" className="mb-1 block text-sm font-semibold">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    name="cvc"
                    type="text"
                    placeholder="123"
                    autoComplete="cc-csc"
                    className="w-full min-w-0 rounded-lg py-2 px-3 border-2 border-gray-300 outline-none focus:border-violet-600"
                  />
                </div>
              </div>
              {/* Tên thẻ */}
              <div>
                <label htmlFor="card-name" className="mb-1 block text-sm font-semibold">
                  Tên thẻ
                </label>
                <input
                  id="card-name"
                  name="cardName"
                  type="text"
                  placeholder="Toni Pham"
                  autoComplete="cc-name"
                  className="w-full min-w-0 rounded-lg py-2 px-3 border-2 border-gray-300 outline-none focus:border-violet-600"
                />
              </div>
            </div>
          )}

          {paymentMethod === "zalopay" && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold">Thanh toán qua ví ZaloPay</h3>
              <div className="flex gap-4">
                <div className="w-28 shrink-0 overflow-hidden">
                  <img
                    src="https://images.openai.com/static-rsc-4/l4hAAqlAzyvjBCshNrI-k65BKEgqvOvVViHET50olPCsi4kZK6zhUwsKegt1zAoNNLTXosQZ_Zoja9wzni48C2tVoCbJCFIuZeJiUwKkuHpGG5GByCem-QTQXVa8Ori8BmAeMh6AHM4DOyHwN5izvuoR6ZrEgKo8q6TmFNj_5Vc5tHULHRBZ9jlSKb9iyZCt?purpose=fullsize"
                    alt="image zalopay"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm leading-6 text-gray-600">
                  1. Mở ứng dụng ZaloPay trên điện thoại.
                  <br />
                  2. Quét mã QR hoặc mở liên kết do hệ thống cung cấp.
                  <br />
                  3. Kiểm tra số tiền và xác nhận giao dịch.
                  <br />
                  4. Chờ hệ thống xác nhận thanh toán.
                </p>
              </div>
            </div>
          )}

          {paymentMethod === "momo" && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <h3 className="mb-4 font-semibold">Thanh toán qua ví MoMo</h3>
              <div className="flex gap-4">
                <div className="w-28 shrink-0 rounded-2xl shadow-2xs overflow-hidden">
                  <img
                    src="https://images.openai.com/static-rsc-4/RoHpxwsWGtaqB8rGKiqQ-UGmEW6VFPJuk3FnwdQ4yfbycv1lsFnDD-TL76OnsC2pDQrWoqjaGBRh03CugYmRVS-YlLuMaJXQfmVqgc6QrN7xP_Bc9Pw9qbot188FgdLO_yV7JtX1DBSgeSQTPHFz4WXoNz5pREjxRotN7-0L8RdgGgCz1pWsJ5cCuL8HDBCa?purpose=fullsize"
                    alt="image momo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm leading-6 text-gray-600">
                  1. Mở ứng dụng MoMo trên điện thoại.
                  <br />
                  2. Quét mã QR hoặc mở liên kết thanh toán.
                  <br />
                  3. Kiểm tra thông tin đơn hàng.
                  <br />
                  4. Xác nhận giao dịch và chờ hệ thống cập nhật.
                </p>
              </div>
            </div>
          )}

          <hr className="my-6 border-gray-300 mt-8" />

          {/* Mã giảm giá */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Mã giảm giá"
              aria-label="Mã giảm giá"
              className="min-w-0 flex-1 rounded-full border border-gray-300 outline-none px-4 py-2.5 text-sm focus:border-violet-600"
            />
            <button
              type="button"
              onClick={() => alert("Nhập Mã giảm giá")}
              className="px-6 py-2.5 rounded-full text-sm font-medium border border-gray-300 hover:text-violet-600
              hover:bg-violet-200 hover:border-violet-600 transition-colors cursor-pointer"
            >
              Áp dụng
            </button>
          </div>

          {/* Tổng kết thanh toán */}
          <div className="mb-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-gray-600">
              <span>Tổng tiền hàng</span>
              <span className="font-semibold text-gray-900">200.000</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Giảm giá (10%)</span>
              <span className="font-semibold text-gray-900">-20.000</span>
            </div>
          </div>

          <hr className="mb-6 border-gray-300" />

          <div className="mb-6 flex justify-between items-center gap-4">
            <span className="font-bold">Tổng thanh toán</span>
            <span className="text-xl font-bold">180.000</span>
          </div>

          {/* Thông tin bảo hành */}
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <ShieldCheck className="mt-0.5 text-gray-500 shrink-0" size={18} />
            <p className="text-xs text-gray-500 leading-relaxed">
              Thanh toán an toàn và bảo mật. Thông tin thanh toán của bạn được bảo vệ.{" "}
              <a
                href="#details"
                className="text-black font-semibold underline hover:text-gray-700"
              >
                Chi tiết
              </a>
            </p>
          </div>

          {/* Nút Thanh toán ngay */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-500 py-4 font-bold
            text-white shadow-md transition-colors hover:bg-violet-700 cursor-pointer"
          >
            Thanh toán ngay
          </button>
        </form>
      </aside>
    </div>
  );
};

export default CheckoutPage;
