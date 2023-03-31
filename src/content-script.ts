import browser from 'webextension-polyfill';
import { HttpService } from './lib/http';
import { SlotsFinder } from './lib/slots-finder';
import { StorageService } from './services/storage';
import { Locations } from '@src/lib/locations';
import { VisitService } from '@src/lib/visit';
import { AppointmentHandler } from '@src/lib/appointment-handler';
import { ResponseStatus } from '@src/lib/internal-types';
import { ActionTypes } from '@src/action-types';
import differenceInDays from 'date-fns/differenceInDays';

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === ActionTypes.IsLoggedIn) {
    await setLoggedIn();
  } else if (message.action === ActionTypes.StartSearch) {
    await findSlot();
  }
});

const storageService = new StorageService();
const httpService = new HttpService();

async function setLoggedIn() {
  const userInfo = await httpService.getUserInfo();
  const isLoggedIn = userInfo?.Results?.isAnonymous === false;
  if (isLoggedIn) {
    await storageService.setLoggedIn(true);
  } else {
    await storageService.setLoggedIn(false);
  }
}

const onAuthFailed = (intervalId: NodeJS.Timeout) => {
  void storageService.setLoggedIn(false);
  clearInterval(intervalId);
};

async function findSlot() {
  const info = await storageService.getUserMetadata();
  const visitService = new VisitService(httpService);
  const appointmentHandler = new AppointmentHandler(httpService);

  if (!info) {
    console.log('Data was not initialized yet');
  }

  const daysDiff = differenceInDays(new Date(info!.lastDate), new Date());
  const preparedVisit = await visitService.prepare(info!);

  if (preparedVisit.status === ResponseStatus.Success) {
    const locations = Locations.filter((location) => info?.cities.includes(location.city));
    const slotsFinder = new SlotsFinder(httpService, locations, info!.preferredTime);
    const intervalId = setInterval(async () => {
      const slots = await slotsFinder.find(daysDiff);
      if (slots[0]) {
        const appointment = await appointmentHandler.setAppointment(preparedVisit.data, slots[0]);
        console.log(appointment);
        clearInterval(intervalId);
      }
    }, 30000);
    httpService.addRejectInterceptor(() => onAuthFailed(intervalId));
  }
}
