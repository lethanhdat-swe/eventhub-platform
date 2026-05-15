import { AvatarUpload } from "./components/AvatarUpload/AvatarUpload";
import EditInfo from "./components/EditInfo/EditInfo";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";

function ProfileHero() {
    return ( 
        <div className="pb-10 border-b border-(--text-primary)/40">
           <div className="flex items-end justify-between">
                <div className="flex items-center gap-5">
                    <AvatarUpload />
                    <ProfileInfo />
                </div>
                <EditInfo />
           </div>
        </div>
     );
}

export default ProfileHero;