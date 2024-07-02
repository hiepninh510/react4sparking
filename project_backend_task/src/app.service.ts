import { Injectable } from '@nestjs/common';
import { TaskService } from './modules/tasks/task.service';

@Injectable()
export class AppService {
  constructor(private readonly taskService: TaskService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async findAllTask(): Promise<any> {
    return this.taskService.findAllTask();
  }
}
