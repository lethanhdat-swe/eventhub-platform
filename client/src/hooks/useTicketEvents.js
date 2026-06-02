import { useEffect, useState } from 'react';

import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

export function useTicketEvents() {
  const [eventFilterOptions, setEventFilterOptions] =
    useState([
      {
        value: 'all',
        label: 'Tất cả',
      },
    ]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await axiosInstance.get(
          '/api/events',
          {
            params: {
              page: 1,
              limit: 100,
            },
          }
        );

        const payload = getApiData(response);

        const events = payload.data ?? [];

        setEventFilterOptions([
          {
            value: 'all',
            label: 'Tất cả',
          },
          ...events.map((event) => ({
            value: event.id,
            label: event.title,
          })),
        ]);
      } catch {
        setEventFilterOptions([
          {
            value: 'all',
            label: 'Tất cả',
          },
        ]);
      }
    }

    void loadEvents();
  }, []);

  return {
    eventFilterOptions,
  };
}