import nock from 'nock';
import { GetCalendarSlotTask, Priority, TaskType } from '@src/content-script/task';
import { BaseURL, HttpService, PartialURLs, Urls } from '@src/lib/http';
import { SearchAvailableSlotsResponse } from '@src/lib/api';
import { PriorityQueue } from '@src/content-script/priority-queue';
import { Handler as GetSlotForCalendar } from '@src/content-script/handlers/get-slot-for-calendar/get-slot-for-calendar';

export class HandlersDriver {
  private queue: PriorityQueue = new PriorityQueue();
  private httpService: HttpService = new HttpService(() => Promise.resolve());
  private getSlotForCalendarHandler = new GetSlotForCalendar({
    httpService: this.httpService,
    priorityQueue: this.queue,
  });

  given = {
    slotsByCalendarId: (calendarId: number, serviceId: number, response: SearchAvailableSlotsResponse) =>
      nock(BaseURL)
        .get(`/${PartialURLs.searchAvailableSlots}`)
        .query({
          CalendarId: calendarId,
          ServiceId: serviceId,
          dayPart: 0,
        })
        .reply(200, response),
  };

  when = {
    getSlotForCalendar: (params: GetCalendarSlotTask['params']) =>
      this.getSlotForCalendarHandler.handle({
        params,
        type: TaskType.GetCalendarSlot,
        priority: Priority.Medium,
      }),
  };

  get = {
    queueTasks: () => this.queue.toArray(),
  };

  reset = () => this.queue.clear();
}
