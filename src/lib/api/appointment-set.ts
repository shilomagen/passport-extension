import { CommonResultsResponse } from './common';

export interface AppointmentSetRequest {
  ServiceId: number;
  appointmentDate: string; //2022-08-18T00:00:00
  appointmentTime: number; //minutes since midnight
  position: string; // {"lat":36,"lng":15,"accuracy":9999}
  preparedVisitId: number;
}

export interface AppointmentSetResult {
  ServiceId: number;
  OrganizationId: number;
  LocationId: number;
  OrganizationName: string;
  ServiceName: string;
  LocationName: string;
  CurrentEntityStatus: number;
  CurrentEntityStatusName: string;
  CurrentServiceId: number;
  QueuePosition: string;
  EntityStatusElapsedTime: number;
  ReferenceDate: Date;
  TicketNumber: string;
  Subject: string;
  EstimatedWT: number;
  SmsAvailable: boolean;
  VisitId: number;
  QflowProcessId: number;
  CancellationAllowed: boolean;
  PositionValidated: boolean;
  WorkingHoursValidated: boolean;
  AllowCustomerToAbandon: boolean;
  EarlyArrival: boolean;
  EarlinessThreshold: number;
  ShowServiceStats: boolean;
  ServiceWaitingTime: number;
  FreezeDuration: string;
  LastSync: number;
  IsLateToAppointment: boolean;
  CanManageQueue: boolean;
  ExtensionTimeAvailable: boolean;
  ExtensionTime: number;
  ExtensionTimeThreshold: number;
  RecallVisitGetInterval: number;
}

export type AppointmentSetResponse = CommonResultsResponse<AppointmentSetResult>
