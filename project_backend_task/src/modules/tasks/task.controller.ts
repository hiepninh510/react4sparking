import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async findAllTask(): Promise<any> {
    return this.taskService.findAllTask();
  }

  @Post()
  async creatTask(@Body() body: any): Promise<any> {
    return this.taskService.creatTask(
      body.taskDTO,
      body.detailTaskDTO,
      body.project,
      body.staff,
    );
  }

  @Put('change-level')
  async changeTask_Level(@Body() body: any): Promise<any> {
    return this.taskService.changeTask_Level(body);
  }

  @Put('change-status')
  async changeTask_Status(@Body() body: any): Promise<any> {
    return this.taskService.changeTask_Status(body);
  }
}
