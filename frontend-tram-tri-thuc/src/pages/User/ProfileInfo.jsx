import EditProfileForm from "../../components/User/EditProfileForm";

const ProfileInfo = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ cá nhân</h2>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <EditProfileForm />
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
