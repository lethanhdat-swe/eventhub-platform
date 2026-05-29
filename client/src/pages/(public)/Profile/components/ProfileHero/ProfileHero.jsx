import { AvatarUpload } from "./components/AvatarUpload/AvatarUpload";
import EditInfo from "./components/EditInfo/EditInfo";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";

function ProfileHero() {
    return ( 
        <div className="pb-10 border-b border-(--text-primary)/40">
           <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-4">
                    <AvatarUpload />
                    <ProfileInfo />
                </div>
                <div className="self-start sm:self-auto">
                    <EditInfo />
                </div>  
           </div>
        </div>
     );
}

export default ProfileHero;