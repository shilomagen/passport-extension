import { BaseHandler } from '@src/content-script/handlers';
import { GetCalendarSlotTask, Priority, TaskType } from '@src/content-script/task';
import { toCalendarSlot, toEnrichedSlot } from '@src/lib/mappers';
import { AnalyticsEventType } from '@src/services/analytics';
import { EnrichedSlot } from '@src/lib/internal-types';

export class Handler extends BaseHandler<GetCalendarSlotTask> {
  async handle(task: GetCalendarSlotTask): Promise<void> {
    const { httpService, slotsQueue } = this.params;
    const { enrichedService, location } = task.params;
    const { calendarId, serviceId } = enrichedService;
    const slots = await httpService.getAvailableSlotByCalendar(calendarId, serviceId);
    const enrichedSlots: EnrichedSlot[] = slots
      .map((slot) => toCalendarSlot(enrichedService, slot))
      .map((s) => toEnrichedSlot(s, location));
    if (enrichedSlots.length > 0) {
      const promises = enrichedSlots.map(async (slot) => {
        slotsQueue.enqueue({
          type: TaskType.ScheduleAppointment,
          params: { slot },
          priority: Priority.High,
        });
        await this.params.analytics.report({
          type: AnalyticsEventType.SlotFound,
          payload: { city: slot.city, date: slot.date, timeSinceMidnight: slot.timeSinceMidnight },
        });
      });
      await Promise.all(promises);
    }
  }
}
