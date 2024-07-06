import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../models/task.model';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { formatDate } from 'src/formats/format.date';
import { DetailTaskModule } from '../detail_tasks/detail_task.module';
import { Task_Project } from 'src/models/task_project.model';
import { ProjectModule } from '../projects/project.module';
import { Staff_Task } from 'src/models/staff_task.model';
import { StaffModule } from '../staffs/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Task_Project, Staff_Task]),
    formatDate,
    DetailTaskModule,
    ProjectModule,
    StaffModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, formatDate],
  exports: [TaskService],
})
export class TaskModule {}
