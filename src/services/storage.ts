import browser from 'webextension-polyfill';

export interface UserMetadata {
  id: string;
  phone: string;
  cities: string[];
  lastDate: number;
}

const USER_METADATA_KEY = 'userMetadata';
const USER_LOGGED_IN = 'userLoggedIn';
const USER_CONSENT = 'userConsent';

const HOUR = 1000 * 60 * 60;

export class StorageService {
  setUserMetadata(metadata: UserMetadata): Promise<void> {
    return browser.storage.local.set({ [USER_METADATA_KEY]: metadata });
  }

  async getUserMetadata(): Promise<UserMetadata | null> {
    return browser.storage.local.get(USER_METADATA_KEY).then((res) => res[USER_METADATA_KEY] ?? null);
  }

  setLoggedIn(loggedIn: boolean): Promise<void> {
    return browser.storage.local.set({
      [USER_LOGGED_IN]: {
        loggedIn,
        expiry: Date.now() + HOUR,
      },
    });
  }

  getLoggedIn(): Promise<boolean> {
    return browser.storage.local.get(USER_LOGGED_IN).then((res) => {
      if (res[USER_LOGGED_IN]) {
        const { loggedIn, expiry } = res[USER_LOGGED_IN];
        return expiry > Date.now() ? loggedIn : browser.storage.local.remove(USER_LOGGED_IN).then(() => false);
      }
    });
  }

  onLoggedInChange(callback: (loggedIn: boolean) => void): void {
    browser.storage.onChanged.addListener((changes) => {
      if (changes[USER_LOGGED_IN]) {
        callback(changes[USER_LOGGED_IN].newValue);
      }
    });
  }

  getConsent(): Promise<boolean> {
    return browser.storage.local.get(USER_CONSENT).then((res) => res[USER_CONSENT] ?? false);
  }

  setConsent(consent: boolean): Promise<void> {
    return browser.storage.local.set({ [USER_CONSENT]: consent });
  }
}
