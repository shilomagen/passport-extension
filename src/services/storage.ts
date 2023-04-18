import browser from 'webextension-polyfill';
import { v4 as uuid } from 'uuid';
import { Service } from '@src/lib/internal-types';

export interface UserMetadata {
  id: string;
  phone: string;
  cities: string[];
  firstDate: number;
  lastDate: number;
}

const USER_METADATA_KEY = 'userMetadata';
const USER_LOGGED_IN = 'userLoggedIn';
const USER_CONSENT = 'userConsent';
const USER_SEARCHING = 'userSearching';
const USER_ID = 'userId';

export const LOCATION_PREFIX = 'location_';

export const HOUR = 1000 * 60 * 60;
export const DAY = HOUR * 24;

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

  async getLoggedIn(): Promise<boolean> {
    const maybeLoggedIn = await browser.storage.local.get(USER_LOGGED_IN);
    if (maybeLoggedIn[USER_LOGGED_IN]) {
      const { loggedIn, expiry } = maybeLoggedIn[USER_LOGGED_IN];
      return expiry > Date.now() ? loggedIn : browser.storage.local.remove(USER_LOGGED_IN).then(() => false);
    } else {
      return false;
    }
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

  setIsSearching(isSearching: boolean): Promise<void> {
    return browser.storage.local.set({ [USER_SEARCHING]: isSearching });
  }

  getIsSearching(): Promise<boolean> {
    return browser.storage.local.get(USER_SEARCHING).then((res) => res[USER_SEARCHING] ?? false);
  }

  async getUserId(): Promise<string> {
    const maybeUserId = await browser.storage.local.get(USER_ID).then((res) => res[USER_ID]);
    if (maybeUserId) {
      return maybeUserId || '';
    } else {
      const userId = uuid();
      await this.setUserId(userId);
      return userId;
    }
  }

  setUserId(id: string): Promise<void> {
    return browser.storage.local.set({ [USER_ID]: id });
  }

  async getServiceIdByLocationId(locationId: number): Promise<Service[] | null> {
    const servicesKey = LOCATION_PREFIX + locationId;
    const maybeServices = await browser.storage.local.get(servicesKey);
    if (maybeServices[servicesKey]) {
      const { expiry, services } = maybeServices[LOCATION_PREFIX + locationId];
      return expiry > Date.now()
        ? services
        : browser.storage.local.remove(LOCATION_PREFIX + locationId).then(() => null);
    } else {
      return null;
    }
  }

  setServiceIdByLocationId(locationId: number, services: Service[]): Promise<void> {
    return browser.storage.local.set({
      [LOCATION_PREFIX + locationId]: {
        expiry: Date.now() + DAY * 3,
        services,
      },
    });
  }
}
