import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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

  @Put('change-task')
  async changeInforTask(@Body() body: any): Promise<any> {
    return this.taskService.changeInfroTask(body);
  }

  @Delete('delete-task/:id')
  async deleteTask(@Param('id') id: any): Promise<any> {
    return this.taskService.deleteTask(id);
  }
}
