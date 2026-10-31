import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { Edit3, Plus } from "lucide-react";

const AddEditBookModal = ({ form, isOpen, setIsOpen, isEdit, onSave }) => {
  const GENRES = [
    "Văn học",
    "Kinh tế",
    "Công nghệ",
    "Kỹ năng sống",
    "Tâm lý học",
    "Lịch sử",
    "Thiếu nhi",
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg border-b border-slate-100 pb-3">
          {isEdit ? (
            <Edit3 className="text-amber-500" size={20} />
          ) : (
            <Plus className="text-indigo-600" size={20} />
          )}
          <span>{isEdit ? "Chỉnh Sửa Thông Tin Sách" : "Thêm Sách Mới Vào Kho"}</span>
        </div>
      }
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      destroyOnClose
      width={650}
      className="rounded-2xl overflow-hidden"
    >
      <Form form={form} layout="vertical" onFinish={onSave} className="pt-3 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="title"
            label="Tên sách"
            rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
            className="col-span-2 mb-2"
          >
            <Input placeholder="Ví dụ: Đắc Nhân Tâm" size="large" />
          </Form.Item>

          <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
            className="mb-2"
          >
            <Input placeholder="Ví dụ: Dale Carnegie" size="large" />
          </Form.Item>

          <Form.Item
            name="genre"
            label="Thể loại"
            rules={[{ required: true }]}
            className="mb-2"
          >
            <Select size="large">
              {GENRES.map((c) => (
                <Select.Option key={c} value={c}>
                  {c}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả tóm tắt" className="col-span-2 mb-2">
            <Input.TextArea
              rows={3}
              placeholder="Mô tả nội dung chính của cuốn sách..."
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá bán (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            className="mb-2"
          >
            <Input
              type="number"
              min={0}
              placeholder="100000"
              size="large"
              addonAfter="₫"
            />
          </Form.Item>

          <Form.Item
            name="coverImage"
            label="URL Ảnh Bìa"
            rules={[{ required: true, message: "Vui lòng dán link ảnh bìa!" }]}
            className="col-span-2 mb-2"
          >
            <Input placeholder="https://images.unsplash.com/..." size="large" />
          </Form.Item>

          <Form.Item
            name="fileUrl"
            label="File sách (EPUB)"
            rules={[{ required: true, message: "Vui lòng tải lên file sách!" }]}
            className="col-span-2 mb-2"
          >
            <Upload />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button onClick={() => setIsOpen(false)}>Hủy bỏ</Button>
          <Button type="primary" htmlType="submit" className="bg-indigo-600">
            {isEdit ? "Cập Nhật" : "Lưu Sách Mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditBookModal;
