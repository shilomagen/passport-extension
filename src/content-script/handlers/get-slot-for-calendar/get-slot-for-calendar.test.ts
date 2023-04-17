import { HandlersDriver } from '@test/handlers.driver';
import { SearchAvailableSlotsResponseFixtures } from '@test/fixtures/search-available-slots-response.fixture';
import { Locations } from '@src/lib/locations';
import { EnrichedService } from '@src/lib/internal-types';
import { Priority, ScheduleAppointmentTask, TaskType } from '@src/content-script/task';
import { AnalyticsEventType } from '@src/services/analytics';

describe('[GetSlotForCalendar Handler]', () => {
  const driver = new HandlersDriver();
  const calendarId = 7456;
  const serviceId = 2654;
  const calendarDate = '2023-05-01';
  const defaultLocation = Locations[0];

  beforeEach(driver.reset);

  test('should enqueue slots in priority queue with priority high', async () => {
    const slot = { Time: 528 };
    const response = SearchAvailableSlotsResponseFixtures.valid({ Results: [slot] });
    driver.given.slotsByCalendarId(calendarId, serviceId, response);
    const enrichedService: EnrichedService = { serviceId, calendarDate, calendarId };
    await driver.when.getSlotForCalendar({ location: defaultLocation, enrichedService });
    expect(driver.get.queueTasks()).toContainEqual<ScheduleAppointmentTask>({
      params: {
        slot: expect.objectContaining({
          timeSinceMidnight: slot.Time,
        }),
      },
      type: TaskType.ScheduleAppointment,
      priority: Priority.High,
    });
  });

  test('should report analytics event when finding slots', async () => {
    const slot = { Time: 528 };
    const response = SearchAvailableSlotsResponseFixtures.valid({ Results: [slot] });
    driver.given.slotsByCalendarId(calendarId, serviceId, response);
    const enrichedService: EnrichedService = { serviceId, calendarDate, calendarId };
    await driver.when.getSlotForCalendar({ location: defaultLocation, enrichedService });
    expect(driver.get.analyticsReports()).toContainEqual({
      data: {
        city: defaultLocation.city,
        date: calendarDate,
        timeSinceMidnight: slot.Time,
      },
      name: AnalyticsEventType.SlotFound,
    });
  });
});
