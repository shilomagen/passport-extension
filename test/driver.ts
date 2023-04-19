import { StorageService } from '@src/services/storage';

const storageService = new StorageService();

export class TestsDriver {
  given = {
    userId: (userId = '1234') => storageService.setUserId(userId),
  };
}
