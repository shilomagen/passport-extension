import { Worker, WorkerConfig } from '@src/content-script/worker';
import { StorageService } from '@src/services/storage';
import { HttpService } from '@src/lib/http';
import { VisitService } from '@src/lib/visit';
import { ResponseStatus } from '@src/lib/internal-types';
import { Locations } from '@src/lib/locations';

export class Gamkenbot {
  private readonly httpService;

  constructor(private readonly worker = new Worker(), private readonly storageService = new StorageService()) {
    this.httpService = new HttpService(async () => {
      await worker.stop();
      await storageService.setLoggedIn(false);
    });
  }

  setLoggedIn = async (): Promise<boolean> => {
    try {
      const userInfo = await this.httpService.getUserInfo();
      await this.storageService.setLoggedIn(userInfo?.Results !== null);
      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  };

  startSearching = async (): Promise<boolean> => {
    const info = await this.storageService.getUserMetadata();
    const visitService = new VisitService(this.httpService);

    if (!info) {
      return false;
    }

    const preparedVisit = await visitService.prepare(info);

    if (preparedVisit.status === ResponseStatus.Success) {
      this.httpService.updateVisitToken(preparedVisit.data.visitToken);
      const locations = Locations.filter((location) => info.cities.includes(location.city));
      const config: WorkerConfig = {
        locations,
        userVisit: preparedVisit.data,
        dateRange: {
          firstDateForAppointment: info.firstDate,
          lastDateForAppointment: info.lastDate,
        },
        httpService: this.httpService,
      };
      await this.worker.start(config);

      return true;
    } else {
      return false;
    }
  };

  stopSearching = async (): Promise<boolean> => {
    try {
      await this.worker.stop();
      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  };
}
