import { BaseHandler, BaseParams } from '@src/content-script/handlers/index';
import { GetServiceIdByLocationIdTask, Priority, Task, TaskType } from '@src/content-script/task';
import { Location, Service } from '@src/lib/internal-types';

export class Handler extends BaseHandler<GetServiceIdByLocationIdTask> {
  constructor(protected readonly params: BaseParams, private readonly locations: Location[]) {
    super(params);
  }

  private createServiceToLocationMap(services: Service[]): Record<string, Location> {
    return services.reduce<Record<string, Location>>((acc, service) => {
      return {
        ...acc,
        [service.id]: this.locations.find((location) => location.id === service.locationId)!,
      };
    }, {});
  }
  async handle(task: GetServiceIdByLocationIdTask): Promise<void> {
    console.log('GetServiceIdByLocationIdTask');
    const { httpService, priorityQueue } = this.params;
    const { locationId } = task.params;
    const services = await httpService.getServiceIdByLocationId(locationId);
    const serviceIdLocationsMap = this.createServiceToLocationMap(services);
    services.map((service) => {
      const serviceId = service.id;
      const task: Task = {
        type: TaskType.GetServiceCalendar,
        params: { location: serviceIdLocationsMap[serviceId], serviceId },
        priority: Priority.Medium,
      };
      priorityQueue.enqueue(task);
    });
  }
}
