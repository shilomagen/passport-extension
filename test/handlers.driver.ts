import nock from 'nock';
import { GetCalendarSlotTask, GetServiceIdByLocationIdTask, Priority, TaskType } from '@src/content-script/task';
import { BaseURL, HttpService, PartialURLs } from '@src/lib/http';
import { LocationServicesResponse, SearchAvailableSlotsResponse } from '@src/lib/api';
import { PriorityQueue } from '@src/content-script/priority-queue';
import { Handler as GetSlotForCalendar } from '@src/content-script/handlers/get-slot-for-calendar/get-slot-for-calendar';
import { Handler as GetServiceByLocation } from '@src/content-script/handlers/get-service-by-location/get-service-by-location';
import { Locations } from '@src/lib/locations';
import { ServiceIds } from '@src/lib/constants';
import { StorageService } from '@src/services/storage';
import browser from 'webextension-polyfill';
import { LocalStorageTestkit } from '@test/testkits/storage.testkit';
import { BaseParams } from '@src/content-script/handlers';

const storageTestkit = browser.storage.local as unknown as LocalStorageTestkit;

export class HandlersDriver {
  private baseParams: BaseParams = {
    priorityQueue: new PriorityQueue(),
    slotsQueue: new PriorityQueue(),
    httpService: new HttpService(() => Promise.resolve()),
    storage: new StorageService(),
  };

  private getSlotForCalendarHandler = new GetSlotForCalendar(this.baseParams);
  private getServiceByLocationHandler = new GetServiceByLocation(this.baseParams, Locations);

  given = {
    storageValue: (val: Record<string, any>) => storageTestkit.set(val),
    slotsByCalendarId: (calendarId: number, serviceId: number, response: SearchAvailableSlotsResponse) =>
      nock(BaseURL)
        .get(`/${PartialURLs.searchAvailableSlots}`)
        .query({
          CalendarId: calendarId,
          ServiceId: serviceId,
          dayPart: 0,
        })
        .reply(200, response),
    serviceByLocationId: (locationId: number, response: LocationServicesResponse) =>
      nock(BaseURL)
        .get(`/${PartialURLs.locationServices}`)
        .query({ locationId, serviceTypeId: ServiceIds.BiometricPassportAppointment })
        .reply(200, response),
  };

  when = {
    getServiceByLocation: (params: GetServiceIdByLocationIdTask['params']) => {
      return this.getServiceByLocationHandler.handle({
        params,
        type: TaskType.GetServiceIdByLocationId,
        priority: Priority.Low,
      });
    },
    getSlotForCalendar: (params: GetCalendarSlotTask['params']) =>
      this.getSlotForCalendarHandler.handle({
        params,
        type: TaskType.GetCalendarSlot,
        priority: Priority.Medium,
      }),
  };

  get = {
    queueTasks: () => this.baseParams.priorityQueue.toArray(),
    slotsQueue: () => this.baseParams.slotsQueue.toArray(),
    storageValue: (key: string) => storageTestkit.get(key),
  };

  reset = () => {
    nock.cleanAll();
    storageTestkit.clear();
    this.baseParams.priorityQueue.clear();
  };
}
