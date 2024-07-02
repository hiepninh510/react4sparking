import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './modules/tasks/task.module';
import { Task } from './models/task.model';
import { Project } from './models/project.model';
import { Company } from './models/company.model';
import { Staff } from './models/staff.model';
import { DetailTask } from './models/detail_task.model';
import { ProjectModule } from './modules/projects/project.module';
import { Task_Project } from './models/task_project.model';
import { DetailTaskModule } from './modules/detail_tasks/detail_task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'QuanLyCongViec',
      entities: [Task, Company, DetailTask, Project, Staff, Task_Project],
    }),
    TaskModule,
    ProjectModule,
    DetailTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
