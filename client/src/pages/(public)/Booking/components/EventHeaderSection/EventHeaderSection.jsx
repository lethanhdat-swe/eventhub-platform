import EventTitle from './components/EventTitle/EventTitle';
import EventMetaInfo from './components/EventMetaInfo/EventMetaInfo';
import EventLineup from './components/EventLineup/EventLineup';
import EventHeroVisual from './components/EventHeroVisual/EventHeroVisual';

function EventHeaderSection({ event, isLoading }) {
  return (
    <section className="rounded-[24px] border border-(--text-primary)/10 bg-(--card-surface-color)/60 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] md:p-6 lg:p-7">
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(340px,500px)] lg:items-center xl:gap-10">
        <div className="space-y-6">
          <EventTitle event={event} isLoading={isLoading} />
          <EventMetaInfo event={event} isLoading={isLoading} />
          <EventLineup eventArtists={event?.eventArtists ?? []} />
        </div>

        <EventHeroVisual event={event} />
      </div>
    </section>
  );
}

export default EventHeaderSection;
