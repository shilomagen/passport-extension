import { HandlersDriver } from '@test/handlers.driver';
import { Locations } from '@src/lib/locations';
import { LocationServicesResultFixtures } from '@test/fixtures/location-service.fixture';
import { LocationServicesResponseFixtures } from '@test/fixtures/location-services-response.fixture';
import { GetServiceCalendarTask, Priority, TaskType } from '@src/content-script/task';
import { DAY, LOCATION_PREFIX } from '@src/services/storage';
import { toService } from '@src/lib/mappers';
import { Service } from '@src/lib/internal-types';

describe('[GetServiceByLocation Handler]', () => {
  const driver = new HandlersDriver();
  const defaultLocation = Locations[0];

  beforeEach(() => {
    driver.reset();
    jest.clearAllMocks();
  });

  test('should fetch services if not in cache', async () => {
    const locationService = LocationServicesResultFixtures.valid({ LocationId: defaultLocation.id });
    const response = LocationServicesResponseFixtures.valid({ Results: [locationService] });
    const scope = driver.given.serviceByLocationId(defaultLocation.id, response);
    await driver.when.getServiceByLocation({ locationId: defaultLocation.id });
    expect(scope.isDone()).toBe(true);
    expect(driver.get.queueTasks()).toContainEqual<GetServiceCalendarTask>({
      params: {
        location: defaultLocation,
        serviceId: locationService.serviceId,
      },
      type: TaskType.GetServiceCalendar,
      priority: Priority.Medium,
    });
  });

  test('should not fetch and get from cache if service exist in cache', async () => {
    const locationService = LocationServicesResultFixtures.valid({ LocationId: defaultLocation.id });
    const response = LocationServicesResponseFixtures.valid({ Results: [locationService] });
    await driver.given.storageValue({
      [LOCATION_PREFIX + defaultLocation.id]: {
        expiry: Date.now() + DAY * 3,
        services: [toService(locationService)],
      },
    });
    const scope = driver.given.serviceByLocationId(defaultLocation.id, response);
    await driver.when.getServiceByLocation({ locationId: defaultLocation.id });
    expect(scope.isDone()).toBe(false);
  });

  test('should add services to cache after first call', async () => {
    const locationService = LocationServicesResultFixtures.valid({ LocationId: defaultLocation.id });
    const response = LocationServicesResponseFixtures.valid({ Results: [locationService] });
    const expectedService = toService(locationService);
    driver.given.serviceByLocationId(defaultLocation.id, response);
    await driver.when.getServiceByLocation({ locationId: defaultLocation.id });
    const cacheKey = LOCATION_PREFIX + defaultLocation.id;
    const cache = await driver.get.storageValue(cacheKey);
    expect(cache[cacheKey].services).toContainEqual<Service>(expectedService);
  });

  test('should remove cache and fetch services if TTL passed', async () => {
    const dateNow = Date.now();
    const locationService = LocationServicesResultFixtures.valid({ LocationId: defaultLocation.id });
    const response = LocationServicesResponseFixtures.valid({ Results: [locationService] });
    await driver.given.storageValue({
      [LOCATION_PREFIX + defaultLocation.id]: { expiry: dateNow, services: [toService(locationService)] },
    });
    Date.now = jest.fn().mockResolvedValueOnce(dateNow + DAY * 4);
    const scope = driver.given.serviceByLocationId(defaultLocation.id, response);
    await driver.when.getServiceByLocation({ locationId: defaultLocation.id });
    expect(scope.isDone()).toBe(true);
  });
});
