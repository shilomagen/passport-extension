import { BaseHandler, BaseParams } from '@src/content-script/handlers';
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

  private publishTask(serviceId: number, location: Location) {
    const { priorityQueue } = this.params;
    const task: Task = {
      type: TaskType.GetServiceCalendar,
      params: { location, serviceId },
      priority: Priority.Medium,
    };
    priorityQueue.enqueue(task);
  }

  private async getServices(locationId: number): Promise<Service[]> {
    const { httpService } = this.params;
    const maybeServices = await this.params.storage.getServiceIdByLocationId(locationId);
    if (maybeServices) {
      return maybeServices;
    } else {
      const services = await httpService.getServiceIdByLocationId(locationId);
      await this.params.storage.setServiceIdByLocationId(locationId, services);
      return services;
    }
  }

  async handle(task: GetServiceIdByLocationIdTask): Promise<void> {
    console.log('GetServiceIdByLocationIdTask');
    const { locationId } = task.params;
    const services = await this.getServices(locationId);
    const serviceIdLocationsMap = this.createServiceToLocationMap(services);
    services.map((service) => {
      this.publishTask(service.id, serviceIdLocationsMap[service.id]);
    });
  }
}
