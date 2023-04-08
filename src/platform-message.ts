import { AnalyticsEvent } from '@src/services/analytics';

export enum ActionTypes {
  IsLoggedIn = 'IS_LOGGED_IN',
  StartSearch = 'START_SEARCH',
  StopSearch = 'STOP_SEARCH',
  ReportAnalytics = 'REPORT_ANALYTICS',
}

export interface ReportAnalyticsMessage {
  action: ActionTypes.ReportAnalytics;
  payload: AnalyticsEvent;
}

interface IsLoggedInMessage {
  action: ActionTypes.IsLoggedIn;
}
interface StartSearchMessage {
  action: ActionTypes.StartSearch;
}

interface StopSearchMessage {
  action: ActionTypes.StopSearch;
}
export type PlatformMessage = ReportAnalyticsMessage | IsLoggedInMessage | StartSearchMessage | StopSearchMessage;
