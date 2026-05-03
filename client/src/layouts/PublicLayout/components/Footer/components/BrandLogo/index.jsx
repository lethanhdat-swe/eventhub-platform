import {
    FacebookIcon,
    InstagramIcon,
    TikTokIcon,
    TwitterIcon,
    YoutubeIcon,
} from "@/assets/icons";
import { Sparkle } from "lucide-react";

function BrandLogo() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Sparkle color="var(--primary-color)" />
                <h1 className="text-xl font-bold text-(--text-primary)">
                    PornHub
                </h1>
            </div>

            <p className="text-sm text-(--text-primary) max-w-70 mb-4">
                Your gateway to unforgettable events. Join us and experience the
                best
            </p>

            <div className="flex items-center gap-4 text-(--text-primary)">
                <FacebookIcon />
                <InstagramIcon />
                <TwitterIcon />
                <TikTokIcon />
                <YoutubeIcon />
            </div>
        </div>
    );
}

export default BrandLogo;
