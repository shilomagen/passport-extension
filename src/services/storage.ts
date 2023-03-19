import browser from 'webextension-polyfill';

export interface UserMetadata {
  id: string;
  phone: string;
  cities: string[];
}

export const USER_METADATA_KEY = 'userMetadata';

export class StorageService {
  setUserMetadata(metadata: UserMetadata): Promise<void> {
    return browser.storage.local.set({ [USER_METADATA_KEY]: metadata });
  }

  async getUserMetadata(): Promise<UserMetadata | null> {
    return browser.storage.local.get(USER_METADATA_KEY).then((res) => res[USER_METADATA_KEY] ?? null);
  }
}
