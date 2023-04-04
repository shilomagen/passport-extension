import { BaseHandler } from '@src/content-script/handlers/index';
import { GetCalendarSlotTask, Priority, TaskType } from '@src/content-script/task';
import { toCalendarSlot, toEnrichedSlot } from '@src/lib/mappers';

export class Handler extends BaseHandler<GetCalendarSlotTask> {
  async handle(task: GetCalendarSlotTask): Promise<void> {
    console.log('GetCalendarSlotTask');
    const { httpService, priorityQueue } = this.params;
    const { enrichedService, location } = task.params;
    const { calendarId, serviceId } = enrichedService;
    const slots = await httpService.getAvailableSlotByCalendar(calendarId, serviceId);
    const enrichedSlots = slots
      .map((slot) => toCalendarSlot(enrichedService, slot))
      .map((s) => toEnrichedSlot(s, location));
    if (enrichedSlots.length > 0) {
      enrichedSlots.map((slot) => {
        priorityQueue.enqueue({
          type: TaskType.ScheduleAppointment,
          params: { slot },
          priority: Priority.High,
        });
      });
    }
  }
}
