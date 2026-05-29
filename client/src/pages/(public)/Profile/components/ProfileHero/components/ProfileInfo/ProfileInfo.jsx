import { useAuthStore } from "@/stores/authStore";

function ProfileInfo() {
    const { user } = useAuthStore();

    if (!user) return <p className="text-(--text-primary)/60">Không thể tải thông tin.</p>;

    return (
        <div className="flex flex-col min-w-0 gap-1">
            <h1 className="text-(--text-primary) text-xl sm:text-2xl truncate">{user.fullName}</h1>
            <p className="text-(--text-primary)/60 text-sm truncate" title={user.email}>{user.email}</p>
            <p className="text-(--text-primary)/60 text-sm truncate">{user.phoneNumber}</p>
        </div>
    );
}

export default ProfileInfo;