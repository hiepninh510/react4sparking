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
import { Task_Project } from './models/task_project.model';
import { Project_Company } from './models/project_company.model';
import { ProjectModule } from './modules/projects/project.module';
import { DetailTaskModule } from './modules/detail_tasks/detail_task.module';
import { CompanyModule } from './modules/companys/company.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Task,
          Company,
          DetailTask,
          Project,
          Staff,
          Task_Project,
          Project_Company,
          // __dirname + '/../**/*.model{.ts,.js}',
        ],
      }),
      inject: [ConfigService],
    }),
    TaskModule,
    ProjectModule,
    DetailTaskModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
