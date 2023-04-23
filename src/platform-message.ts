export enum ActionTypes {
  IsLoggedIn = 'IS_LOGGED_IN',
  StartSearch = 'START_SEARCH',
  StopSearch = 'STOP_SEARCH',
  ReportAnalytics = 'REPORT_ANALYTICS',
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
export type PlatformMessage = IsLoggedInMessage | StartSearchMessage | StopSearchMessage;
