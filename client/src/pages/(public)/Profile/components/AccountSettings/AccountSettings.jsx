import ChangePasswordCard from './components/ChangePasswordCard/ChangePasswordCard';

function AccountSettings() {
  return (
    <div className="mt-8">
      <h1 className="text-(--text-primary) text-xl font-medium mb-4">
        Cài đặt tài khoản
      </h1>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-4">
          <ChangePasswordCard />
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
