/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../models/task.model';
import { Repository } from 'typeorm';
import { createTaskDTO } from './dto/creattask.dto';
import { formatDate } from '../../formats/format.date';
import { createDetail_TaskDTO } from '../detail_tasks/dto/creatdetail_task.dto';
import { DetailTaskService } from '../detail_tasks/detail_task.service';
// import { level_TaskDTO, status_TaskDTO } from './dto/updatetask.dto';
import { ProjectService } from '../projects/project.service';
import { Task_Project } from 'src/models/task_project.model';
import { updateTaskDTO } from './dto/updatetask.dto';
import { Staff_Task } from 'src/models/staff_task.model';
import { StaffService } from '../staffs/staff.service';
import { Staff } from 'src/models/staff.model';

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
    private readonly staffService: StaffService,
    @InjectRepository(Staff_Task)
    private readonly staff_taskReonsitory: Repository<Staff_Task>,
  ) {}

  async findAllTask(): Promise<any> {
    const tasks = await this.taskRepository.find();
    const staff_task = await this.staff_taskReonsitory.find();
    const _staffs = await this.staffService.getAllStaff();

    const taskMap = new Map<string, Task & { staff: Staff[] }>();
    tasks.forEach((task) => {
      taskMap.set(task.id, { ...task, staff: [] });
    });
    staff_task.forEach((item) => {
      const task = taskMap.get(item.task_id);
      if (task) {
        _staffs.forEach((staff) => {
          if (staff.id === item.staff_id) {
            task.staffs.push(staff);
          }
        });
      }
    });
    const task_Arr = await Promise.all(
      Array.from(taskMap.values()).map(async (item) => ({
        id: item.id,
        name: item.name_task,
        start_day: await this._format.formatForDisplay(item.start_day),
        finish_day: await this._format.formatForDisplay(item.finish_day),
        status: item.status_task,
        level: item.level_task,
        staff: item.staffs,
      })),
    );
    return task_Arr;
  }

  async creatTask(
    taskDTO: createTaskDTO,
    detailTaskDTO: Partial<createDetail_TaskDTO>,
    id_project: string,
    id_staff: string,
  ): Promise<any> {
    const project = await this.projectService.findNameProject(id_project);
    if (project) {
      const taskSQL = new Task();
      taskSQL.name_task = taskDTO.name;
      taskSQL.start_day = taskDTO.start_day;
      taskSQL.finish_day = taskDTO.finish_day;
      taskSQL.status_task = taskDTO.status;
      taskSQL.level_task = taskDTO.level;
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
        const tableTaskProject =
          await this.project_taskReponstory.save(task_project);
        if (tableTaskProject) {
          const tableStaffTask = new Staff_Task();
          const staff = await this.staffService.findOneStaff(id_staff);
          if (staff) {
            tableStaffTask.name_staff = staff.name_staff;
            tableStaffTask.name_task = taskSQL.name_task;
            tableStaffTask.staff_id = staff.id;
            tableStaffTask.task_id = taskSQL.id;
            await this.staff_taskReonsitory.save(tableStaffTask);
            return taskSQL;
          } else {
            return {
              message: 'Lưu dữ liệu vào bảng staff_task không thành công!',
            };
          }
        } else {
          return {
            Masege: 'Lưu dữ liệu vào bảng task_project không thành công!',
          };
        }
      } else {
        return { Masege: 'Mô tả công việc khởi tạo không thành công' };
      }
    }
  }

  async changeTask_Level(body: Partial<updateTaskDTO>): Promise<any> {
    const task = await this.taskRepository.findOne({ where: { id: body.id } });
    task.level_task = body.level.toString();
    await this.taskRepository.save(task);
    return { message: `Đã thay đổi level thành: ${task.level_task}` };
  }

  async changeTask_Status(body: Partial<updateTaskDTO>): Promise<any> {
    const task = await this.taskRepository.findOne({ where: { id: body.id } });
    task.status_task = body.status.toString();
    await this.taskRepository.save(task);
    return { message: `Đã thay đổi status thành: ${task.status_task}` };
  }
}
