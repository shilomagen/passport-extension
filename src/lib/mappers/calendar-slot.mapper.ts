import { CalendarSlot, EnrichedService } from '../internal-types';

export function toCalendarSlot({
                                 calendarDate,
                                 serviceId
                               }: EnrichedService, timeSinceMidnight: number): CalendarSlot {
  return {
    date: calendarDate,
    timeSinceMidnight,
    serviceId
  };
}
