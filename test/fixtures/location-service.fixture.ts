import { overridable } from '../overridable';
import { LocationServicesResult } from '@src/lib/api';

const defaultService = (): LocationServicesResult => {
  return {
    serviceId: 2095,
    serviceName: 'תיאום פגישה לתיעוד ביומטרי',
    serviceDescription: '',
    ServiceTypeId: 156,
    serviceTypeDescription: '',
    description: 'בכל פנייה יינתן שירות לפונה/אדם אחד בלבד',
    showStats: false,
    waitingTime: 0,
    HasCalendarService: true,
    DynamicFormsEnabled: true,
    HasFIFOService: false,
    ExtRef: '',
    LocationId: 799,
  };
};

export const LocationServicesResultFixtures = {
  valid: overridable(() => defaultService()),
};
