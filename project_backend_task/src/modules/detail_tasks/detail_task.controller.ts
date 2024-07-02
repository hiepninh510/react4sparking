import { Controller, Get, Param } from '@nestjs/common';
import { DetailTaskService } from './detail_task.service';

@Controller()
export class DetailTaskController {
  constructor(private readonly detailTaskService: DetailTaskService) {}

  @Get('task/:id')
  async findTaskID(@Param('id') id: string): Promise<any> {
    return this.detailTaskService.findTaskID(id);
  }
}
