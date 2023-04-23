import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { Task } from './task';

export class PriorityQueue {
  private readonly queue: MaxPriorityQueue<Task> = new MaxPriorityQueue<Task>((task) => task.priority);

  clear() {
    return this.queue.clear();
  }

  isEmpty() {
    return this.queue.isEmpty();
  }

  enqueue(task: Task) {
    this.queue.enqueue(task);
  }

  dequeue(): Task {
    return this.queue.dequeue();
  }

  toArray(): Task[] {
    return this.queue.toArray();
  }
}
