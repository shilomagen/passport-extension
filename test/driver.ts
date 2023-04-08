import { StorageService } from '@src/services/storage';
import Mixpanel from 'mixpanel-browser';
import { MixpanelTestkit } from './testkits/mixpanel.testkit';

const mixpanelTestkit: jest.Mocked<MixpanelTestkit> = Mixpanel as any;
const storageService = new StorageService();

export class TestsDriver {
  given = {
    userId: (userId = '1234') => storageService.setUserId(userId),
  };

  get = {
    reports: () => mixpanelTestkit.getReports(),
    analyticsUserId: () => mixpanelTestkit.getUserId(),
  };

  reset = () => {
    mixpanelTestkit.reset();
  };
}
