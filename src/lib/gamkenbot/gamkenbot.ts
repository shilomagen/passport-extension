import { AxiosError } from 'axios';
import { Worker, WorkerConfig } from './worker';
import { StorageService } from '@src/services/storage';
import { HttpService } from '@src/lib/http';
import { VisitService } from '@src/lib/visit';
import { ResponseStatus, SearchStatusType } from '@src/lib/internal-types';
import { Locations } from '@src/lib/locations';
import { dispatchSearchStatus } from '../utils/status';
import { errors as Content } from '@src/content.json';

export class Gamkenbot {
  constructor(private readonly worker = new Worker(), private readonly storageService = new StorageService()) {}

  onRejectError = async (error: AxiosError): Promise<void> => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      this.worker.stop();
      dispatchSearchStatus({ type: SearchStatusType.Error, message: Content.authError });
      await this.storageService.setLoggedIn(false);
    } else {
      dispatchSearchStatus({ type: SearchStatusType.Warning, message: Content.failingRequests });
    }
  };

  setLoggedIn = async (): Promise<boolean> => {
    const httpService = new HttpService(this.onRejectError);
    try {
      const userInfo = await httpService.getUserInfo();
      await this.storageService.setLoggedIn(userInfo?.Results !== null);
      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  };

  startSearching = async (): Promise<boolean> => {
    dispatchSearchStatus({ type: SearchStatusType.Waiting });

    const httpService = new HttpService(this.onRejectError);
    const info = await this.storageService.getUserMetadata();
    const visitService = new VisitService(httpService);

    if (!info) {
      dispatchSearchStatus({ type: SearchStatusType.Error, message: Content.noUserData });
      return false;
    }

    try {
      const preparedVisit = await visitService.prepare(info);
      if (preparedVisit.status === ResponseStatus.Success) {
        httpService.updateVisitToken(preparedVisit.data.visitToken);
        const locations = Locations.filter((location) => info.cities.includes(location.city));
        const config: WorkerConfig = {
          locations,
          userVisit: preparedVisit.data,
          dateRangeForAppointment: {
            startDate: info.startDate,
            endDate: info.endDate,
          },
          httpService: httpService,
        };
        await this.worker.start(config);

        return true;
      } else {
        throw new Error(`Error code ${preparedVisit.data.errorCode}`);
      }
    } catch (err) {
      console.error(err);
      dispatchSearchStatus({ type: SearchStatusType.Error, message: Content.questionsFailed });
      return false;
    }
  };

  stopSearching = async (): Promise<boolean> => {
    try {
      await this.worker.stop();
      dispatchSearchStatus({ type: SearchStatusType.Stopped });
      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  };
}
