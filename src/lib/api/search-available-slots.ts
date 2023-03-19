import { CommonResultsResponse } from './common';

export interface SearchAvailableSlotsRequest {
  CalendarId: number;
  ServiceId: number;
  dayPart: number;
}

interface SearchAvailableSlotsResult {
  Time: number; // minutes since midnight
}

export type SearchAvailableSlotsResponse = CommonResultsResponse<SearchAvailableSlotsResult[]>
