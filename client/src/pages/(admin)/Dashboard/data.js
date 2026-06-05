const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const numberFormatter = new Intl.NumberFormat('vi-VN');

const STAT_META = [
  { key: 'revenue', title: 'Tổng doanh thu' },
  { key: 'tickets', title: 'Vé đã bán' },
  { key: 'events', title: 'Sự kiện đang hoạt động' },
  { key: 'checkin', title: 'Tỷ lệ check-in' },
];

export function formatEventDate(date) {
  if (!date) return '—';
  return dateFormatter.format(new Date(date));
}

export function formatCheckInTime(date) {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}

export function formatDashboardRevenue(amount) {
  if (amount == null || amount === 0) return '0';
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000;
    return `${billions.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ`;
  }
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} triệu`;
  }
  return numberFormatter.format(amount);
}

export function formatTrendPercent(value) {
  if (value == null) return undefined;
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value}%`;
}

export function formatEventsTrend(delta) {
  if (delta == null) return undefined;
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta}`;
}

export function formatTicketCodeDisplay(code) {
  if (!code) return '—';
  if (code.length <= 20) return code;
  return `${code.slice(0, 12)}…`;
}

/**
 * @param {{ revenue?: number }[]} points
 */
export function getRevenueChartScale(points) {
  const maxRevenue = Math.max(
    0,
    ...(points ?? []).map((point) => point.revenue ?? 0)
  );

  if (maxRevenue >= 1_000_000) {
    return { divisor: 1_000_000, unitLabel: 'triệu VNĐ' };
  }

  if (maxRevenue >= 1_000) {
    return { divisor: 1_000, unitLabel: 'nghìn VNĐ' };
  }

  return { divisor: 1, unitLabel: 'VNĐ' };
}

/**
 * @param {Record<string, unknown>} data
 */
export function mapDashboardSummary(data) {
  const stats = data?.stats ?? {};

  const statValues = {
    revenue: {
      value: formatDashboardRevenue(stats.totalRevenue),
      trend: formatTrendPercent(stats.revenueGrowthPercent),
    },
    tickets: {
      value: numberFormatter.format(stats.soldTickets ?? 0),
      trend: formatTrendPercent(stats.soldTicketsGrowthPercent),
    },
    events: {
      value: numberFormatter.format(stats.activeEvents ?? 0),
      trend: formatEventsTrend(stats.activeEventsGrowth),
    },
    checkin: {
      value: `${stats.checkinRate ?? 0}%`,
      trend: formatTrendPercent(stats.checkinRateGrowthPercent),
    },
  };

  const mappedStats = STAT_META.map(({ key, title }) => ({
    key,
    title,
    value: statValues[key]?.value ?? '—',
    trend: statValues[key]?.trend,
  }));

  const rawRevenueChart = data?.revenueChart ?? [];
  const revenueChartScale = getRevenueChartScale(rawRevenueChart);
  const revenueChart = rawRevenueChart.map((point) => {
    const rawRevenue = point.revenue ?? 0;

    return {
      label: point.label,
      revenue: rawRevenue / revenueChartScale.divisor,
      rawRevenue,
    };
  });

  const recentOrders = (data?.recentOrders ?? []).map((order) => ({
    id: order.id,
    orderCode: order.orderCode,
    customerName: order.customerName,
    totalAmount: order.totalAmount ?? 0,
    status: order.status,
  }));

  const featuredEvents = (data?.topEvents ?? []).map((event) => ({
    id: event.id,
    title: event.name,
    startDate: event.date,
    ticketsSold: event.soldTickets ?? 0,
  }));

  const checkIns = (data?.recentCheckins ?? []).map((item) => ({
    id: item.id,
    customerName: item.customerName,
    ticketCode: formatTicketCodeDisplay(item.ticketCode),
    checkedInAt: item.checkedInAt,
  }));

  return {
    stats: mappedStats,
    revenueChart,
    revenueChartUnit: revenueChartScale.unitLabel,
    recentOrders,
    featuredEvents,
    checkIns,
  };
}
