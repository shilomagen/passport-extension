import mixpanel from 'mixpanel-browser';
import { StorageService } from '@src/services/storage';

// Don't worry, it's a public token :)
const MIXPANEL_PUBLIC_TOKEN = 'c46304b0b7c1c715c013537a62026434';

export enum AnalyticsEventType {
  StartSearch = 'start_search',
  SlotFound = 'slot_found',
  AppointmentScheduled = 'appointment_scheduled',
  StopSearch = 'stop_search',
}

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  payload?: Record<string, string | number>;
}

export class Analytics {
  constructor(private readonly storage: StorageService = new StorageService()) {
    mixpanel.init(MIXPANEL_PUBLIC_TOKEN);
  }

  report = async (event: AnalyticsEvent): Promise<boolean> => {
    mixpanel.identify(await this.storage.getUserId());
    mixpanel.track(event.type, event.payload ? event.payload : {});
    return true;
  };
}
