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
    detail: Partial<createDetail_TaskDTO>,
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

  async deleteDetailTask(id_task: string): Promise<any> {
    const delete_detail = await this.detailTaskResponitory.delete({
      id_task: id_task,
    });
    if (delete_detail) {
      return { message: `Đã xóa thành công: ${delete_detail}` };
    } else {
      return { message: `Xóa không thành công! ${id_task}` };
    }
  }
}
