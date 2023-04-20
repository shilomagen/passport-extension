import { CommonResultsResponse } from './common';

export interface LocationServicesRequest {
  currentPage?: number;
  isFavorite?: boolean;
  orderBy?: string;
  locationId: number;
  resultsInPage?: number;
  serviceTypeId?: number;
}

export interface LocationServicesResult {
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  ServiceTypeId: number;
  serviceTypeDescription: string;
  description: string;
  showStats: boolean;
  waitingTime: number;
  HasCalendarService: boolean;
  DynamicFormsEnabled: boolean;
  HasFIFOService: boolean;
  ExtRef: string;
  LocationId: number;
}
export type LocationServicesResponse = CommonResultsResponse<LocationServicesResult[]>;
