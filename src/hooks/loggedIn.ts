import { useEffect, useState } from 'react';
import { StorageService } from '@src/services/storage';

const storageService = new StorageService();

export const useLoggedIn = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    storageService.getLoggedIn().then(setLoggedIn);
  }, []);

  storageService.onLoggedInChange(setLoggedIn);

  return loggedIn;
};
