import { BaseHandler, BaseParams } from '@src/content-script/handlers/index';
import { DateUtils } from '@src/lib/utils';
import { GetServiceCalendarTask, Priority, TaskType } from '@src/content-script/task';

export class Handler extends BaseHandler<GetServiceCalendarTask> {
  constructor(params: BaseParams, private readonly maxDaysUntilAppointment: number) {
    super(params);
  }

  async handle(task: GetServiceCalendarTask): Promise<void> {
    console.log('GetServiceCalendarTask');
    const { httpService, priorityQueue } = this.params;
    const { serviceId, location } = task.params;
    const calendars = await httpService.getCalendars(serviceId);
    const relevantCalendars = calendars.filter(({ calendarDate }) =>
      DateUtils.isDateInDaysRange(calendarDate, this.maxDaysUntilAppointment),
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
