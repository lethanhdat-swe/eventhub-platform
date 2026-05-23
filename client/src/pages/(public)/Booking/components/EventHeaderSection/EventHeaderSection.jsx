import EventTitle from "./components/EventTitle/EventTitle";
import EventMetaInfo from "./components/EventMetaInfo/EventMetaInfo";
import EventLineup from "./components/EventLineup/EventLineup";
import EventHeroVisual from "./components/EventHeroVisual/EventHeroVisual";

function EventHeaderSection({ event, isLoading }) {
  return (
    <div className="grid grid-cols-1 gap-6 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-6 lg:grid-cols-[1fr_minmax(320px,460px)] lg:p-8">
      <div className="space-y-6">
        <EventTitle event={event} isLoading={isLoading} />
        <EventMetaInfo event={event} isLoading={isLoading} />
        <EventLineup eventArtists={event?.eventArtists ?? []} />
      </div>
      <EventHeroVisual event={event} />
    </div>
  );
}

export default EventHeaderSection;