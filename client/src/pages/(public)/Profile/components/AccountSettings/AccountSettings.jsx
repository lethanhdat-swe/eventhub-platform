import ChangePasswordCard from './components/ChangePasswordCard/ChangePasswordCard';

function AccountSettings() {
  return (
    <div className="mt-8">
      <h1 className="text-(--text-primary) text-xl font-medium mb-4">
        Cài đặt tài khoản
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <ChangePasswordCard />
      </div>
    </div>
  );
}

export default AccountSettings;