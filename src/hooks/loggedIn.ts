import { useEffect, useState } from 'react';
import { StorageService } from '@src/services/storage';

const storageService = new StorageService();

export const useLoggedIn = (): boolean => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    storageService.getLoggedIn().then(setLoggedIn);
    const unsubscribe = storageService.onLoggedInChange(setLoggedIn);

    return () => {
      unsubscribe();
    };
  }, []);

  return loggedIn;
};
