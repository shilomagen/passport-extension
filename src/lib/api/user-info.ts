import { CommonResultsResponse } from '@src/lib/api/common';

export interface User {
  username: string;
  emaiAddress: string; // That's not a typo, it's how they spelled it
  isAnonymous: boolean;
  isExternalLogin: boolean;
  hasSingleActiveVisitToday: boolean;
  hasMultipleVisits: boolean;
  visitsCount: number;
  hasActiveVisits: boolean;
  visitId: number;
  smsNotificationsEnabled: boolean;
  smsVerified: boolean;
  phoneMask: string;
  token: string;
}

export type GetUserInfoResponse = CommonResultsResponse<User>;
