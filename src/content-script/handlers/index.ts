import { PriorityQueue } from '@src/content-script/priority-queue';
import { BaseTask } from '@src/content-script/task';
import { HttpService } from '@src/lib/http';
import { StorageService } from '@src/services/storage';
import { Analytics } from '@src/services/analytics';

export interface BaseParams {
  priorityQueue: PriorityQueue;
  slotsQueue: PriorityQueue;
  httpService: HttpService;
  storage: StorageService;
  analytics: Analytics;
}

export abstract class BaseHandler<T extends BaseTask, R = void> {
  constructor(protected readonly params: BaseParams) {}

  abstract handle(task: T): Promise<R>;
}
