import { overridable } from '../overridable';
import { LocationServicesResponse } from '@src/lib/api';

const defaultResponse = (): LocationServicesResponse => {
  return {
    Success: true,
    Results: [
      {
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
      },
    ],
    Page: 0,
    ResultsPerPage: 0,
    TotalResults: 18,
    ErrorMessage: null,
    ErrorNumber: 0,
    Messages: [],
  };
};

export const LocationServicesResponseFixtures = {
  valid: overridable(() => defaultResponse()),
};
