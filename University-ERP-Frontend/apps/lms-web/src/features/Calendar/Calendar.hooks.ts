import { useQuery } from '@tanstack/react-query';
import { calendarApi } from './Calendar.api';

export function useCalendarEvents(month?: string) {
  return useQuery({
    queryKey: ['lmsCalendar', month],
    queryFn: () => calendarApi.getEvents(month)
  });
}
