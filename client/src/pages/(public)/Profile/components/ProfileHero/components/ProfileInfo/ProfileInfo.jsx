import { useAuthStore } from "@/stores/authStore";

function ProfileInfo() {
    const { user } = useAuthStore();

    if (!user) return <p className="text-(--text-primary)/60">Không thể tải thông tin.</p>;

    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-(--text-primary) text-2xl">{user.fullName}</h1>
            <p className="text-(--text-primary)/60">{user.email}</p>
            <p className="text-(--text-primary)/60">{user.phoneNumber}</p>
        </div>
    );
}

export default ProfileInfo;