import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../models/task.model';
import { Repository } from 'typeorm';
import { createTaskDTO } from './dto/creattask.dto';
import { formatDate } from '../../formats/format.date';
import { createDetail_TaskDTO } from '../detail_tasks/dto/creatdetail_task.dto';
import { DetailTaskService } from '../detail_tasks/detail_task.service';
import { level_TaskDTO, status_TaskDTO } from './dto/updatetask.dto';
import { ProjectService } from '../projects/project.service';
import { Task_Project } from 'src/models/task_project.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly _format: formatDate,
    private readonly deatailTaskService: DetailTaskService,
    private readonly projectService: ProjectService,
    @InjectRepository(Task_Project)
    private readonly project_taskReponstory: Repository<Task_Project>,
  ) {}

  async findAllTask(): Promise<any> {
    const tasks = await this.taskRepository.find();
    const task_Arr = [];
    for (const item of tasks) {
      const task = {
        id: item.id,
        name: item.name_task,
        start_day: await this._format.formatForDisplay(item.start_day),
        finish_day: await this._format.formatForDisplay(item.finish_day),
        status: item.status_task,
        level: item.level_task,
      };
      task_Arr.push(task);
    }
    return task_Arr;
  }

  async creatTask(
    taskDTO: createTaskDTO,
    detailTaskDTO: createDetail_TaskDTO,
    nameProject: string,
  ): Promise<any> {
    const project = await this.projectService.findNameProject(nameProject);
    if (project) {
      const taskSQL = new Task();
      (taskSQL.name_task = taskDTO.name),
        (taskSQL.start_day = taskDTO.start_day),
        (taskSQL.finish_day = taskDTO.finish_day),
        (taskSQL.status_task = taskDTO.status),
        (taskSQL.level_task = taskDTO.level),
        await this.taskRepository.save(taskSQL);
      const message = await this.deatailTaskService.createDetailTask(
        detailTaskDTO,
        taskSQL.id,
      );
      if (message) {
        const task_project = new Task_Project();
        task_project.project_id = project.id;
        task_project.name_project = project.name_project;
        task_project.task_id = taskSQL.id;
        task_project.name_task = taskSQL.name_task;
        await this.project_taskReponstory.save(task_project);
        return taskSQL;
      } else {
        return { Masege: 'Mô tả công việc khởi tạo không thành công' };
      }
    }
  }

  async changeTask_Level(body: level_TaskDTO): Promise<any> {
    const task = await this.taskRepository.findOne({ where: { id: body.id } });
    task.level_task = body.level.toString();
    await this.taskRepository.save(task);
    return { message: `Đã thay đổi level thành: ${task.level_task}` };
  }

  async changeTask_Status(body: status_TaskDTO): Promise<any> {
    const task = await this.taskRepository.findOne({ where: { id: body.id } });
    task.status_task = body.status.toString();
    await this.taskRepository.save(task);
    return { message: `Đã thay đổi status thành: ${task.status_task}` };
  }
}
