import EventTitle from "./components/EventTitle/EventTitle";
import EventMetaInfo from "./components/EventMetaInfo/EventMetaInfo";
import EventLineup from "./components/EventLineup/EventLineup";
import EventHeroVisual from "./components/EventHeroVisual/EventHeroVisual";

function EventHeaderSection() {
  return (
    <div className="grid grid-cols-2 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-10">
      <div className="space-y-8">
        <EventTitle />
        <EventMetaInfo />
        <EventLineup />
      </div>
        <EventHeroVisual />
    </div>
  );
}

export default EventHeaderSection;