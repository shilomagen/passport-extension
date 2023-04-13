import { HandlersDriver } from '@test/handlers.driver';
import { SearchAvailableSlotsResponseFixtures } from '@test/fixtures/search-available-slots-response.fixture';
import { Locations } from '@src/lib/locations';
import { EnrichedService } from '@src/lib/internal-types';
import { Priority, ScheduleAppointmentTask, TaskType } from '@src/content-script/task';

describe('[GetSlotForCalendar Handler]', () => {
  const driver = new HandlersDriver();
  const calendarId = 7456;
  const serviceId = 2654;
  const calendarDate = '2023-05-01';

  test('should enqueue slots in priority queue with priority high', async () => {
    const slot = { Time: 528 };
    const response = SearchAvailableSlotsResponseFixtures.valid({ Results: [slot] });
    driver.given.slotsByCalendarId(calendarId, serviceId, response);
    const enrichedService: EnrichedService = { serviceId, calendarDate, calendarId };
    await driver.when.getSlotForCalendar({ location: Locations[0], enrichedService });
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

  test.todo('should report analytics event when finding slots');
});
