import browser from 'webextension-polyfill';
import { SearchStatus } from "@src/lib/internal-types";
import { ActionTypes, PlatformMessage } from "@src/platform-message";
import { StorageService } from '@src/services/storage';

const storageService = new StorageService()

export const dispatchSearchStatus = async (status: SearchStatus) => {
    await storageService.setSearchStatus(status);
    await browser.runtime.sendMessage({ action: ActionTypes.SetSearchStatus, status } as PlatformMessage)
}