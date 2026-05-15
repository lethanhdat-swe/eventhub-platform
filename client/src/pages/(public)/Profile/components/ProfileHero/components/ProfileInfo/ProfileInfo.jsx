import { Calendar, Mars } from "lucide-react";

function ProfileInfo() {
    return ( 
        <div>
            <div className="flex flex-col gap-1">
                <h1 className="text-(--text-primary) text-2xl">Quân Thái</h1>
                <p className="text-(--text-primary)/60 ">thaithanhquan11102005@gmail.com</p>
                <p className="text-(--text-primary)/60 ">(+84) 912 99 999</p>
            </div>

            <div className="flex items-center gap-20 mt-6">
                <div className="flex gap-3">
                    <Calendar color="var(--primary-color)"/> 
                    <div className="flex flex-col text-(--text-primary)/60">
                        <p>Ngày sinh</p>
                        <p>12/1/11998</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Mars color="var(--primary-color)"/> 
                    <div className="flex flex-col text-(--text-primary)/60">
                        <p>Giới tính</p>
                        <p>Nam</p>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default ProfileInfo;