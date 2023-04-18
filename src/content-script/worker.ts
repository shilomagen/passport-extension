import { HttpService } from '@src/lib/http';
import { Location, UserVisitSuccessData } from '@src/lib/internal-types';
import { Handler as GetServiceByLocationHandler } from '@src/content-script/handlers/get-service-by-location/get-service-by-location';
import { Handler as GetServiceCalendarHandler } from '@src/content-script/handlers/get-service-calendar';
import { Handler as GetSlotForCalendarHandler } from '@src/content-script/handlers/get-slot-for-calendar/get-slot-for-calendar';
import { Handler as Scheduler } from '@src/content-script/handlers/scheduler';
import { match } from 'ts-pattern';
import { PriorityQueue } from '@src/content-script/priority-queue';
import {
  GetServiceIdByLocationIdTask,
  Priority,
  ScheduleAppointmentTask,
  Task,
  TaskType,
} from '@src/content-script/task';
import { BaseParams } from '@src/content-script/handlers';
import { StorageService } from '@src/services/storage';
import { Analytics } from '@src/services/analytics';
import setRandomInterval, { RandomIntervalClear } from '@src/utils/random-interval';

export interface WorkerConfig {
  locations: Location[];
  userVisit: UserVisitSuccessData;
  maxDaysUntilAppointment: number;
  httpService: HttpService;
}

export class Worker {
  private clearFunc: RandomIntervalClear | null = null;
  private slotsInterval: NodeJS.Timer | null = null;
  private settingAppointment = false;

  constructor(
    private readonly priorityQueue: PriorityQueue = new PriorityQueue(),
    private readonly slotsQueue: PriorityQueue = new PriorityQueue(),
    private readonly storageService = new StorageService(),
  ) {}

  fillQueue(locations: Location[]) {
    locations.forEach((location) => {
      const task: GetServiceIdByLocationIdTask = {
        type: TaskType.GetServiceIdByLocationId,
        params: { locationId: location.id },
        priority: Priority.Low,
      };
      this.priorityQueue.enqueue(task);
    });
  }

  tick = (config: WorkerConfig): void => {
    if (!this.priorityQueue.isEmpty()) {
      const task = this.priorityQueue.dequeue();
      this.handle(task, config).catch((err) => console.error(err));
    } else {
      this.fillQueue(config.locations);
    }
  };

  schedule = (config: WorkerConfig): void => {
    if (!this.slotsQueue.isEmpty()) {
      const task = this.slotsQueue.dequeue();
      this.handle(task, config).catch((err) => console.error(err));
    }
  };

  start = async (config: WorkerConfig): Promise<void> => {
    this.clearFunc = setRandomInterval(() => this.tick(config), 500, 2000);
    this.slotsInterval = setInterval(() => this.schedule(config), 300);
    await this.storageService.setIsSearching(true);
  };

  stop = async (): Promise<void> => {
    if (this.clearFunc) {
      this.clearFunc.clear();
      this.clearFunc = null;
      this.priorityQueue.clear();
    }
    if (this.slotsInterval) {
      clearInterval(this.slotsInterval);
      this.slotsInterval = null;
      this.slotsQueue.clear();
    }
    await this.storageService.setIsSearching(false);
  };

  async scheduleAppointment(
    task: ScheduleAppointmentTask,
    userVisit: UserVisitSuccessData,
    params: BaseParams,
  ): Promise<void> {
    if (!this.settingAppointment) {
      this.settingAppointment = true;
      const scheduleAppointment = new Scheduler(params, userVisit);
      const res = await scheduleAppointment.handle(task);
      if (res.isDone) {
        await this.stop();
      } else {
        this.settingAppointment = false;
      }
    } else {
      this.priorityQueue.enqueue(task);
    }
  }

  handle(task: Task, config: WorkerConfig) {
    const { locations, maxDaysUntilAppointment, userVisit, httpService } = config;
    const params: BaseParams = {
      priorityQueue: this.priorityQueue,
      slotsQueue: this.slotsQueue,
      storage: this.storageService,
      analytics: new Analytics(),
      httpService,
    };
    return match(task)
      .with({ type: TaskType.GetServiceIdByLocationId }, (task) =>
        new GetServiceByLocationHandler(params, locations).handle(task),
      )
      .with({ type: TaskType.GetServiceCalendar }, (task) =>
        new GetServiceCalendarHandler(params, maxDaysUntilAppointment).handle(task),
      )
      .with({ type: TaskType.GetCalendarSlot }, (task) => new GetSlotForCalendarHandler(params).handle(task))
      .with({ type: TaskType.ScheduleAppointment }, (task) => this.scheduleAppointment(task, userVisit, params))
      .exhaustive();
  }
}
