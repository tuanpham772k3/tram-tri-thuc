import UploadForm from "../../components/Uploader/UploadForm";

const UploadPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Đăng tài liệu mới</h1>
            <UploadForm />
        </div>
    );
};

export default UploadPage;
