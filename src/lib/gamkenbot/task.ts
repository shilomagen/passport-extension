import { EnrichedService, EnrichedSlot, Location } from '@src/lib/internal-types';

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
}

export enum TaskType {
  GetServiceIdByLocationId = 'getServiceIdByLocationId',
  GetServiceCalendar = 'getServiceCalendar',
  GetCalendarSlot = 'getCalendarSlot',
  ScheduleAppointment = 'scheduleAppointment',
}

export interface BaseTask {
  priority: Priority;
}

export interface GetServiceIdByLocationIdTask extends BaseTask {
  type: TaskType.GetServiceIdByLocationId;
  params: {
    locationId: number;
  };
}

export interface GetServiceCalendarTask extends BaseTask {
  type: TaskType.GetServiceCalendar;
  params: {
    location: Location;
    serviceId: number;
  };
}

export interface GetCalendarSlotTask extends BaseTask {
  type: TaskType.GetCalendarSlot;
  params: {
    location: Location;
    enrichedService: EnrichedService;
  };
}

export interface ScheduleAppointmentTask extends BaseTask {
  type: TaskType.ScheduleAppointment;
  params: {
    slot: EnrichedSlot;
  };
}

export type Task =
  | GetServiceIdByLocationIdTask
  | GetServiceCalendarTask
  | GetCalendarSlotTask
  | ScheduleAppointmentTask;
