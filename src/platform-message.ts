import { SearchStatus } from './lib/internal-types';

export enum ActionTypes {
  IsLoggedIn = 'IS_LOGGED_IN',
  StartSearch = 'START_SEARCH',
  StopSearch = 'STOP_SEARCH',
  SetSearchStatus = 'SET_SEARCH_STATUS',
  RefreshAntiBotCookies = 'REFRESH_ANTI_BOT_COOKIE',
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

interface SearchStatusMessage {
  action: ActionTypes.SetSearchStatus;
  status: SearchStatus;
}

interface RefreshAntiBotCookiesMessage {
  action: ActionTypes.RefreshAntiBotCookies;
}

export type PlatformMessage =
  | IsLoggedInMessage
  | StartSearchMessage
  | StopSearchMessage
  | SearchStatusMessage
  | RefreshAntiBotCookiesMessage;
