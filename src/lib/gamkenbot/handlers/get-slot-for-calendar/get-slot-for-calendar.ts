import { BaseHandler } from '@src/lib/gamkenbot/handlers';
import { GetCalendarSlotTask, Priority, TaskType } from '../../task';
import { toCalendarSlot, toEnrichedSlot } from '@src/lib/mappers';
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
      });
      await Promise.all(promises);
    }
  }
}
