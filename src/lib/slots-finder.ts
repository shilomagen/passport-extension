import { HttpService, loopWithDelay } from './http';
import { EnrichedService, EnrichedSlot, Location, Service } from './internal-types';
import { toCalendarSlot, toEnrichedSlot } from './mappers';
import { DateUtils } from './utils';

export class SlotsFinder {
  constructor(private readonly httpService: HttpService, private readonly locations: Location[]) {}

  private async handleSlotsForCalendar(enrichedService: EnrichedService, location: Location): Promise<EnrichedSlot[]> {
    const { calendarId, serviceId } = enrichedService;
    const slots = await this.httpService.getAvailableSlotByCalendar(calendarId, serviceId);
    const enrichedSlots = slots
      .map((slot) => toCalendarSlot(enrichedService, slot))
      .map((s) => toEnrichedSlot(s, location));
    return enrichedSlots;
  }

  private createServiceToLocationMap(services: Service[], locations: Location[]): Record<string, Location> {
    return services.reduce<Record<string, Location>>((acc, service) => {
      return {
        ...acc,
        [service.id]: locations.find((location) => location.id === service.locationId)!,
      };
    }, {});
  }

  private async handleCalendar(
    serviceId: number,
    maxDaysUntilAppointment: number,
    location: Location,
  ): Promise<EnrichedSlot[]> {
    const calendars = await this.httpService.getCalendars(serviceId);
    const relevantCalendars = calendars.filter(({ calendarDate }) =>
      DateUtils.isDateInDaysRange(calendarDate, maxDaysUntilAppointment),
    );
    return loopWithDelay(relevantCalendars, (enrichedService) =>
      this.handleSlotsForCalendar(enrichedService, location),
    ).then((res) => res.flat());
  }

  async find(maxDaysUntilAppointment: number): Promise<EnrichedSlot[]> {
    const services = await loopWithDelay(
      this.locations.map(({ id }) => id),
      (id) => this.httpService.getServiceIdByLocationId(id),
    ).then((res) => res.flat());
    const serviceIdToLocationMap = this.createServiceToLocationMap(services, this.locations);
    const serviceIds = services.map((service) => service.id);
    return Promise.all(
      serviceIds.map((serviceId) =>
        this.handleCalendar(serviceId, maxDaysUntilAppointment, serviceIdToLocationMap[serviceId]),
      ),
    ).then((res) => res.flat());
  }
}
