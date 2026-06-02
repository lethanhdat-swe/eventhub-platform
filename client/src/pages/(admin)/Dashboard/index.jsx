import { Banknote, CalendarDays, ScanLine, Ticket } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getErrorMessage } from '@/lib/http/apiError';
import { dashboardService } from '@/lib/services/admin/dashboardService';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import StatsCard from '@/pages/(admin)/components/StatsCard';
import DashboardDatePicker from '@/pages/(admin)/Dashboard/components/DashboardDatePicker';
import FeaturedEventsCard from '@/pages/(admin)/Dashboard/components/FeaturedEventsCard';
import RecentOrdersCard from '@/pages/(admin)/Dashboard/components/RecentOrdersCard';
import RevenueChartCard from '@/pages/(admin)/Dashboard/components/RevenueChartCard';
import TodayCheckInsCard from '@/pages/(admin)/Dashboard/components/TodayCheckInsCard';
import { mapDashboardSummary } from '@/pages/(admin)/Dashboard/data';
import {
  DEFAULT_DASHBOARD_DATE_RANGE,
  getDateRangeLabel,
  getStatPeriodDescription,
} from '@/pages/(admin)/Dashboard/dateRange';

const STAT_ICONS = {
  revenue: Banknote,
  tickets: Ticket,
  events: CalendarDays,
  checkin: ScanLine,
};

const EMPTY_SUMMARY = {
  stats: [],
  revenueChart: [],
  recentOrders: [],
  featuredEvents: [],
  checkIns: [],
};

function Dashboard() {
  const [dateRange, setDateRange] = useState(DEFAULT_DASHBOARD_DATE_RANGE);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const periodLabel = getDateRangeLabel(dateRange);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSummary({
        from: dateRange.from,
        to: dateRange.to,
      });
      setSummary(mapDashboardSummary(data));
    } catch (err) {
      setError(getErrorMessage(err));
      setSummary(EMPTY_SUMMARY);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange.from, dateRange.to]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = summary.stats ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Bảng điều khiển"
          description="Theo dõi tổng quan hoạt động bán vé, sự kiện và check-in."
        />
        <DashboardDatePicker
          value={dateRange}
          onChange={setDateRange}
          className="w-full sm:w-auto"
        />
      </div>

      {error ? (
        <div
          className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={loadDashboard}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading && stats.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-27 rounded-xl" />
            ))
          : stats.map((stat) => (
              <StatsCard
                key={stat.key}
                title={stat.title}
                value={stat.value}
                description={getStatPeriodDescription(stat.key, dateRange)}
                trend={stat.trend}
                icon={STAT_ICONS[stat.key]}
              />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChartCard
          periodLabel={periodLabel}
          chartData={summary.revenueChart}
          isLoading={isLoading}
          isEmpty={!isLoading && summary.revenueChart.length === 0}
        />
        <RecentOrdersCard
          periodLabel={periodLabel}
          orders={summary.recentOrders}
          isLoading={isLoading}
          isEmpty={!isLoading && summary.recentOrders.length === 0}
        />
        <FeaturedEventsCard
          periodLabel={periodLabel}
          events={summary.featuredEvents}
          isLoading={isLoading}
          isEmpty={!isLoading && summary.featuredEvents.length === 0}
        />
        <TodayCheckInsCard
          periodLabel={periodLabel}
          dateRange={dateRange}
          checkIns={summary.checkIns}
          isLoading={isLoading}
          isEmpty={!isLoading && summary.checkIns.length === 0}
        />
      </div>
    </div>
  );
}

export default Dashboard;

