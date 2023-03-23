import browser from 'webextension-polyfill';

export interface UserMetadata {
  id: string;
  phone: string;
  cities: string[];
  lastDate: number;
}

const USER_METADATA_KEY = 'userMetadata';
const USER_LOGGED_IN = 'userLoggedIn';

export class StorageService {
  setUserMetadata(metadata: UserMetadata): Promise<void> {
    return browser.storage.local.set({ [USER_METADATA_KEY]: metadata });
  }

  async getUserMetadata(): Promise<UserMetadata | null> {
    return browser.storage.local.get(USER_METADATA_KEY).then((res) => res[USER_METADATA_KEY] ?? null);
  }

  setLoggedIn(loggedIn: boolean): Promise<void> {
    return browser.storage.local.set({ [USER_LOGGED_IN]: loggedIn });
  }

  getLoggedIn(): Promise<boolean> {
    return browser.storage.local.get(USER_LOGGED_IN).then((res) => res[USER_LOGGED_IN] ?? false);
  }

  onLoggedInChange(callback: (loggedIn: boolean) => void): void {
    browser.storage.onChanged.addListener((changes) => {
      if (changes[USER_LOGGED_IN]) {
        callback(changes[USER_LOGGED_IN].newValue);
      }
    });
  }
}
