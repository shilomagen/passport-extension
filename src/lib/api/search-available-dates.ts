import { CommonResultsResponse } from './common';

export interface SearchAvailableDatesRequest {
  maxResults?:number;
  serviceId:number;
  startDate: string; //YYYY-MM-DD
}

export interface SearchAvailableDatesResult {
  calendarDate: string;
  calendarId: number;
}
export type SearchAvailableDatesResponse = CommonResultsResponse<SearchAvailableDatesResult[]>


