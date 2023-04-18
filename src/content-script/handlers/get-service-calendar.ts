import { BaseHandler, BaseParams } from '@src/content-script/handlers/index';
import { DateUtils } from '@src/lib/utils';
import { GetServiceCalendarTask, Priority, TaskType } from '@src/content-script/task';
import { DateRange } from '@src/lib/internal-types';

export class Handler extends BaseHandler<GetServiceCalendarTask> {
  constructor(params: BaseParams, private readonly dateRangeForAppointment: DateRange) {
    super(params);
  }

  async handle(task: GetServiceCalendarTask): Promise<void> {
    const { httpService, priorityQueue } = this.params;
    const { serviceId, location } = task.params;
    const calendars = await httpService.getCalendars(serviceId, this.dateRangeForAppointment.startDate);
    const relevantCalendars = calendars.filter(({ calendarDate }) =>
      DateUtils.isDateInRange(
        calendarDate,
        new Date(this.dateRangeForAppointment.startDate),
        new Date(this.dateRangeForAppointment.endDate),
      ),
    );
    relevantCalendars.map((calendar) => {
      priorityQueue.enqueue({
        type: TaskType.GetCalendarSlot,
        params: {
          location,
          enrichedService: calendar,
        },
        priority: Priority.Medium,
      });
    });
  }
}
