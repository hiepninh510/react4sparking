import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailTask } from 'src/models/detail_task.model';
import { Repository } from 'typeorm';
import { createDetail_TaskDTO } from './dto/creatdetail_task.dto';

@Injectable()
export class DetailTaskService {
  constructor(
    @InjectRepository(DetailTask)
    private readonly detailTaskResponitory: Repository<DetailTask>,
  ) {}

  async findTaskID(id: string): Promise<DetailTask> {
    return this.detailTaskResponitory.findOne({ where: { id_task: id } });
  }

  async createDetailTask(
    detail: createDetail_TaskDTO,
    id: string,
  ): Promise<any> {
    let message: string;
    const detailTask = new DetailTask();
    detailTask.task_description = detail.task_description;
    detailTask.id_task = id;
    (await this.detailTaskResponitory.save(detailTask))
      ? (message = 'Thành Công')
      : (message = null);
    return message;
  }
}
