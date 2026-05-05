import { AppleIcon, GooglePlayIcon } from '@/assets/icons';

function AppDownload() {
  return (
    <div className="flex flex-col gap-1 pl-6 border-l-2 border-[#29282a]">
      <h3 className="text-lg font-bold text-(--text-primary) capitalize tracking-wider">
        Download Our App
      </h3>
      <p className="text-gray-500">Get tickets on the go.</p>

      <div className="flex gap-4 pt-4">
        <button className="flex items-center gap-2 px-4 py-2 text-white bg-black border border-gray-700 rounded-md cursor-pointe">
          <AppleIcon size={30} />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase">Download on the</span>
            <span className="text-lg font-bold">App Store</span>
          </div>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 text-white bg-black border border-gray-700 rounded-md cursor-pointe">
          <GooglePlayIcon size={30} />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase">GET IT ON</span>
            <span className="text-lg font-bold">Google Play</span>
          </div>
        </button>
      </div>
    </div>
  );
}
export default AppDownload;
