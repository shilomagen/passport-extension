import { CommonResultsResponse } from './common';

export interface AppointmentCancelRequest {
  visitId: number;
  position: string;
  url: string;
}

interface AppointmentCancelResult {
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

export type AppointmentCancelResponse = CommonResultsResponse<AppointmentCancelResult>
