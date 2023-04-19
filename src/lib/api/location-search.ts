import { CommonResultsResponse } from './common';

export interface LocationSearchRequest {
  currentPage?: number;
  isFavorite?: boolean;
  orderBy?: string;
  organizationId: number;
  resultsInPage?: number;
  serviceTypeId?: number;
  src?: string;
}

export interface LocationSearchResult {
  OrganizationId: number;
  OrganizationName: string;
  LocationId: number;
  LocationName: string;
  Address1: string;
  Address2: string;
  City: string;
  State: string;
  Country: string;
  Description: string;
  Directions: string;
  ZipCode: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
  WaitingTime: number;
  ShowStats: boolean;
  IsFavorite: boolean;
  ServiceCount: number;
  LastUseDate: string;
  HasCalendarService: boolean;
  HasFIFOService: boolean;
  ServiceId: number;
  ServiceHasFIFO: boolean;
  DynamicFormsEnabled: boolean;
  PhoneNumber: string;
  ExtRef: string;
  ServiceTypeId: number;
  MaxWaitingTime: number;
}

export type LocationSearchResponse = CommonResultsResponse<LocationSearchResult[]>;
