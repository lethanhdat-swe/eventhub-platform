import { useParams } from "react-router-dom";
import { orders } from "../Profile/components/ProfileOrders/components/TicketOrder/components/data";
import CheckInHero from "./components/CheckInHero/CheckInHero";
import QRCheckInCard from "./components/QRCheckInCard/QRCheckInCard";
import TicketInformationSection from "./components/TicketInformationSection/TicketInformationSection";
import TicketDownloadSection from "./components/TicketDownloadSection/TicketDownloadSection";

function EventCheckInPage() {
    const { id } = useParams();
    const event = orders.find((e) => e.id === id);

   if (!event) {
    return (
      <div className="pt-(--header-height) text-white text-3xl">
        Event not found
      </div>
    );
  }

  return (
        <div className="pt-(--header-height) px-10 mb-10 flex flex-col gap-4 items-center justify-center w-full">
            <CheckInHero />
            <QRCheckInCard />
            <TicketInformationSection event={event}/>
            <TicketDownloadSection />
        </div>
  );
}

export default EventCheckInPage;