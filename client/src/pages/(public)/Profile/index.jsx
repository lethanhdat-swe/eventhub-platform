import AccountSettings from "./components/AccountSettings/AccountSettings";
import ProfileHero from "./components/ProfileHero/ProfileHero";
import ProfileOrders from "./components/ProfileOrders/ProfileOrders";

function Profile() {
    return (
        <div className="pt-(--header-height) px-10 pb-10">
            <ProfileHero />
            <ProfileOrders />
            <AccountSettings />
        </div>
      );
}

export default Profile;