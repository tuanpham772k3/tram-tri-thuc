import { Checkbox } from "antd";
import { Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";

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

const CartPage = () => {
  const [items, setItems] = useState(cartItems);
  const [productIds, setProductIds] = useState([]);
  console.log("🚀 ~ CartPage ~ productIds:", productIds);

  const updateQuantity = (id, amount) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + amount),
            }
          : item
      )
    );
  };

  const handleSelectIdAllProducts = (checked) => {
    setProductIds(checked ? items.map((item) => item.id) : []);
  };

  const handleSelectIdProduct = (id) => {
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-8">
      {/* Phần 1: bảng sản phẩm bên trái (chiếm 2 cột) */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        {/* Tiêu đề Trang */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Giỏ hàng</h1>
          <span className="text-xl font-bold">2 item</span>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Tiêu đề bảng */}
        <div className="grid grid-cols-12 text-sm font-semibold text-gray-500 pb-4 border-b border-gray-100 mb-6">
          <div className="col-span-1">
            <Checkbox
              checked={items.length > 0 && items.length === productIds.length}
              onChange={(e) => handleSelectIdAllProducts(e.target.checked)}
              indeterminate={productIds.length > 0 && productIds.length < items.length}
            />
          </div>
          <div className="col-span-4">Sản phẩm</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-2 text-center">Số tiền</div>
          <div className="col-span-1 text-center">Thao tác</div>
        </div>

        {/* Danh sách sản phẩm */}
        <ul className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              Giỏ hàng của bạn đang trống
            </div>
          ) : (
            items.map((item) => {
              const itemTotal = (item.price * item.quantity).toFixed(0);
              return (
                <li key={item.id} className="py-6 grid grid-cols-12 items-center gap-4">
                  {/* Checkbox */}
                  <Checkbox
                    checked={productIds.includes(item.id)}
                    onChange={() => handleSelectIdProduct(item.id)}
                  />

                  {/* Thông tin sản phẩm & Hình ảnh */}
                  <div className="col-span-4 md:flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg mb-0.5">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">{item.author}</p>
                    </div>
                  </div>

                  {/* Gía */}
                  <div className="col-span-2 text-sm md:text-base text-center">
                    ${item.price}
                  </div>

                  {/* Số lượng (Quantity Stepper) */}
                  <div className="col-span-2 flex justify-center">
                    <div className="inline-flex flex-col md:flex-row items-center justify-center gap-2 border border-gray-300 rounded-full px-3 py-1.5 bg-white shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity === 1}
                        className="text-gray-500 hover:text-black transition-colors focus:outline-none cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-center text-gray-500 hover:text-black transition-colors focus:outline-none cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Tổng tiền sản phẩm */}
                  <div className="col-span-2 text-center font-bold text-gray-900 text-base md:text-lg">
                    ${itemTotal}
                  </div>

                  {/* Nút xóa (Action) */}
                  <div className="col-span-1 text-center">
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 cursor-pointer"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Phần 2: Order Summary bên phải (Chiếm 1 cột) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Tóm tắt đơn hàng</h2>

          <hr className="border-gray-300 mb-6" />

          {/* Ô nhập mã giảm giá & Nút Apply */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Phiếu giảm giá"
              className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2.5 text-sm
                focus:outline-none focus:border-violet-600 transition-colors text-gray-800 placeholder-gray-400"
            />
            <button
              className="px-6 py-2.5 border border-gray-300 rounded-full text-sm font-medium
              text-gray-700 hover:text-violet-600 hover:bg-violet-200 hover:border-violet-600
              transition-colors cursor-pointer"
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
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng</span>
              <span className="font-semibold text-gray-900">50.00 USD</span>
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
              90 Day Limited Warranty against manufacturer's defects{" "}
              <a
                href="#details"
                className="text-black font-semibold underline hover:text-gray-700"
              >
                Chi tiết
              </a>
            </p>
          </div>
        </div>

        {/* Nút Checkout Now */}
        <button
          className="w-full bg-violet-500 text-white py-4 rounded-full font-bold text-base
          hover:bg-violet-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          Checkout Now
        </button>
      </div>
    </div>
  );
};

export default CartPage;
