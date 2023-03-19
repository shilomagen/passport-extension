import browser from 'webextension-polyfill';
import { HttpService } from './lib/http';
import { SlotsFinder } from './lib/slots-finder';
import { StorageService } from './services/storage';
import { Locations } from '@src/lib/locations';
import { VisitService } from '@src/lib/visit';
import { AppointmentHandler } from '@src/lib/appointment-handler';
import { ResponseStatus } from '@src/lib/internal-types';

browser.runtime.onMessage.addListener(findSlot);

const storageService = new StorageService();

async function findSlot() {
  const info = await storageService.getUserMetadata();
  const httpService = new HttpService();
  const visitService = new VisitService(httpService);
  const appointmentHandler = new AppointmentHandler(httpService);

  if (!info) {
    console.log('Data was not initialized yet');
  }

  const preparedVisit = await visitService.prepare(info!);
  if (preparedVisit.status === ResponseStatus.Success) {
    const locations = Locations.filter((location) => info?.cities.includes(location.city));
    const slotsFinder = new SlotsFinder(httpService, locations);
    const slots = await slotsFinder.find(500);
    if (slots[0]) {
      const appointment = await appointmentHandler.setAppointment(preparedVisit.data, slots[0]);
      console.log(appointment);
    }
  }
}
