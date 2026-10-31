import { Button, Modal } from "antd";
import { ShieldAlert } from "lucide-react";

const BookDetailModal = ({
  isOpen,
  setIsOpen,
  onEditBook,
  selectedBook,
  renderStatusBadge,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={[
        <Button key="close" onClick={() => setIsOpen(false)}>
          Đóng
        </Button>,
        <Button
          key="edit"
          type="primary"
          className="bg-indigo-600"
          onClick={() => {
            setIsOpen(false);
            onEditBook(selectedBook);
          }}
        >
          Chỉnh sửa
        </Button>,
      ]}
      width={600}
    >
      {selectedBook && (
        <div className="pt-2 space-y-4">
          <div className="flex gap-4">
            <img
              src={selectedBook.coverImage}
              alt={selectedBook.title}
              className="w-32 h-44 object-cover rounded-xl shadow-md border border-slate-200 shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {renderStatusBadge(selectedBook.status, selectedBook.rejectReason)}
                <span className="text-xs text-slate-400 font-mono">
                  ID: {selectedBook.id}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 leading-snug">
                {selectedBook.title}
              </h2>
              <p className="text-xs text-slate-500">
                Tác giả:{" "}
                <span className="font-semibold text-slate-700">
                  {selectedBook.author}
                </span>
              </p>

              <div className="text-xl font-extrabold text-indigo-600 pt-1">
                {selectedBook.price.toLocaleString("vi-VN")} ₫
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400">Thể loại:</span>{" "}
                  {selectedBook.category}
                </div>
                <div>
                  <span className="text-slate-400">Mã ISBN:</span> {selectedBook.isbn}
                </div>
                <div>
                  <span className="text-slate-400">Số lượng:</span> {selectedBook.stock}{" "}
                  bản
                </div>
                <div>
                  <span className="text-slate-400">Ngày đăng:</span>{" "}
                  {selectedBook.createdAt}
                </div>
              </div>
            </div>
          </div>

          {selectedBook.status === "REJECTED" && selectedBook.rejectReason && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 text-xs text-rose-800">
              <ShieldAlert size={18} className="shrink-0 text-rose-600 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Lý do từ chối duyệt:</span>
                {selectedBook.rejectReason}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mô tả nội dung
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedBook.description || "Chưa có mô tả cho cuốn sách này."}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookDetailModal;
