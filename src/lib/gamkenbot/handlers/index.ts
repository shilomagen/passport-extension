import { PriorityQueue } from '../priority-queue';
import { BaseTask } from '../task';
import { HttpService } from '@src/lib/http';
import { StorageService } from '@src/services/storage';

export interface BaseParams {
  priorityQueue: PriorityQueue;
  slotsQueue: PriorityQueue;
  httpService: HttpService;
  storage: StorageService;
}

export abstract class BaseHandler<T extends BaseTask, R = void> {
  constructor(protected readonly params: BaseParams) {}

  abstract handle(task: T): Promise<R>;
}
