import {
  Banknote,
  CalendarDays,
  ScanLine,
  Ticket,
} from 'lucide-react';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import StatsCard from '@/pages/(admin)/components/StatsCard';
import FeaturedEventsCard from '@/pages/(admin)/Dashboard/components/FeaturedEventsCard';
import RecentOrdersCard from '@/pages/(admin)/Dashboard/components/RecentOrdersCard';
import RevenueChartCard from '@/pages/(admin)/Dashboard/components/RevenueChartCard';
import TodayCheckInsCard from '@/pages/(admin)/Dashboard/components/TodayCheckInsCard';
import { DASHBOARD_STATS } from '@/pages/(admin)/Dashboard/data';

const STAT_ICONS = {
  revenue: Banknote,
  tickets: Ticket,
  events: CalendarDays,
  checkin: ScanLine,
};

function Dashboard() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Bảng điều khiển"
        description="Theo dõi tổng quan hoạt động bán vé, sự kiện và check-in."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatsCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            trend={stat.trend}
            icon={STAT_ICONS[stat.key]}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChartCard />
        <RecentOrdersCard />
        <FeaturedEventsCard />
        <TodayCheckInsCard />
      </div>
    </div>
  );
}

export default Dashboard;
